import axios from "axios";
import { inngest } from "./client";
import { createClient } from "@deepgram/sdk";
import { GenerateImageScript } from "../configs/AIModel";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import * as admin from "firebase-admin";

export const maxDuration=30;

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}
const bucket = admin.storage().bucket();

const ImagePromptScript = `
Generate Image prompt of {style} style with all details for each scene for 30 seconds video: script : {script} 
- No need of intro to response directly generate.
- Just Give specifing image prompt depending on the story line
- donot give camera angle image prompt
- Follow the following schema and return JSON data(Max 4-5 Images)
-[
    {
      imagePrompt:'',
      sceneContent:'<Script Content>'
    }
]
`;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const GenerateVideoData = inngest.createFunction(
  { id: "generate-video-data" },
  { event: "generate-video-data" },
  async ({ event, step }) => {
    const { script, topic, title, caption, videoStyle, voice, recordId, audioUrl } = event?.data;
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

    // Instead of generating audio, we already have the audio URL from the frontend
    const GenerateAudioFile = audioUrl;

    // --- Generate captions using Deepgram ---
    const GenerateCaptions = await step.run("generatedCaptions", async () => {
      const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);
      const { result } = await deepgram.listen.prerecorded.transcribeUrl(
        { url: GenerateAudioFile },
        { model: "nova-3" }
      );
      return result?.results?.channels[0]?.alternatives[0]?.words;
    });

    // --- Generate image prompts from script ---
    const GenerateImagePrompts = await step.run("generateImagePrompt", async () => {
      const FINAL_PROMPT = ImagePromptScript
        .replace("{style}", videoStyle)
        .replace("{script}", script);
      const result = await GenerateImageScript.sendMessage(FINAL_PROMPT);
      const resp = JSON.parse(result.response.text());
      return resp;
    });

    async function fetchImage(imagePrompt, retryCount = 0) {
      const maxRetries = 5;
      try {
        const response = await axios.post(
          "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
          { inputs: imagePrompt },
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_API_KEY}`,
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
          }
        );
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 429 && retryCount < maxRetries) {
          // Calculate exponential backoff delay (e.g., 5, 10, 20, 40... seconds)
          const delayMs = 5000 * Math.pow(2, retryCount);
          console.warn(`Rate limited. Retrying in ${delayMs / 1000} seconds...`);
          await delay(delayMs);
          return fetchImage(imagePrompt, retryCount + 1);
        } else {
          throw error;
        }
      }
    }

    const GenerateImages = await step.run("generateImages", async () => {
      const images = [];
      for (const element of GenerateImagePrompts) {
        const imageData = await fetchImage(element?.imagePrompt);
        const buffer = Buffer.from(imageData, "binary");
        const base64Image = buffer.toString("base64");
        images.push(`data:image/png;base64,${base64Image}`);
        // Optional: a small delay between requests to be safe
        await delay(1000);
      }
      return images;
    });


    // --- Save all generated data to the database ---
    const UpdateDB = await step.run("UpdateDB", async () => {
      const result = await convex.mutation(api.videoData.UpdateVideoRecord, {
        recordId: recordId,
        audioUrl: GenerateAudioFile,
        captionJson: GenerateCaptions,
        images: GenerateImages,
      });
      return result;
    });

    return "Executed Successfully!";
  }
);