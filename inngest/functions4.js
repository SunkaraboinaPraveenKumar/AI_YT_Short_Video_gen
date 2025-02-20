import { GenerateImageScript } from "@/configs/AIModel";
import { HfInference } from "@huggingface/inference";
import { inngest } from "./client";
import { ConvexHttpClient } from "convex/browser";
import { createClient } from "@deepgram/sdk";
import { api } from "@/convex/_generated/api";



const ImagePromptScript=`
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
`
const hfClient = new HfInference(process.env.NEXT_PUBLIC_HF_API_KEY);

// Helper function to convert Blob to Buffer
async function blobToBuffer(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
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

    // --- Generate images using HfInference for increased speed ---
    const GenerateImages = await step.run("generateImages", async () => {
      const images = [];
      for (const element of GenerateImagePrompts) {
        // Call the HfInference textToImage method
        const blobImage = await hfClient.textToImage({
          model: "black-forest-labs/FLUX.1-schnell",
          inputs: element?.imagePrompt,
          parameters: { num_inference_steps: 5 },
          provider: "together",
        });
        // Convert the returned Blob into a Buffer
        const buffer = await blobToBuffer(blobImage);
        const base64Image = buffer.toString("base64");
        images.push(`data:image/png;base64,${base64Image}`);
        // Optional delay between requests to avoid hitting rate limits
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
