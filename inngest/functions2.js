import axios from "axios";
import { inngest } from "./client";
import { createClient } from "@deepgram/sdk";
import {GenerateImageScript} from "../configs/AIModel"
import { ConvexHttpClient } from "convex/browser";
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

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);


const BASE_URL = 'https://aigurulab.tech';
export const GenerateVideoData = inngest.createFunction(
  { id: 'generate-video-data' },
  { event: 'generate-video-data' },
  async ({ event, step }) => {
    const { script, topic, title, caption, videoStyle, voice, recordId } = event?.data
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
    // Generate audio mp3
    const GenerateAudioFile = await step.run(
      "GenerateAudioFile",
      async () => {
        const result = await axios.post(BASE_URL + '/api/text-to-speech',
          {
            input: script,
            voice: voice
          },
          {
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_AI_GURU_API_KEY,
              'Content-Type': 'application/json',
            },
          })
        console.log(result?.data?.audio)
        return result.data.audio;
      }
    )

    // generate captions
    const GenerateCaptions=await step.run(
      "generatedCaptions",
      async()=>{
        const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);    

        const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
          {
            url: GenerateAudioFile,
          },
          {
            model: "nova-3"
          }
        );

        return result?.results?.channels[0]?.alternatives[0]?.words
      }
    )
    // generate image prompt from script
    const GenerateImagePrompts=await step.run(
      "generateImagePrompt",
      async()=>{
        const FINAL_PROMPT = ImagePromptScript
        .replace('{style}', videoStyle)
        .replace('{script}',script)
        const result = await GenerateImageScript.sendMessage(FINAL_PROMPT)

        const resp = JSON.parse(result.response.text())

        return resp;
      }
    )

    // generate images using ai
    const GenerateImages = await step.run(
      "generateImages",
      async()=>{
        let images=[];
        images = await Promise.all(
          GenerateImagePrompts.map(async(element)=>{
            const result = await axios.post(BASE_URL + '/api/generate-image',
          {
            width:1024,
            height:1024,
            input:element?.imagePrompt,
            model:'sdxl',
            aspectRatio:"1:1"
          },
          {
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_AI_GURU_API_KEY,
              'Content-Type': 'application/json',
            },
          })
        // console.log(result?.data?.image)
        return result.data.image;
          })
        )
        return images
      }
    )
    // save all data to db

    const UpdateDB=await step.run(
      'UpdateDB',
      async()=>{
        const result = await convex.mutation(api.videoData.UpdateVideoRecord,{
          recordId: recordId,
          audioUrl:GenerateAudioFile,
          captionJson:GenerateCaptions,
          images:GenerateImages
        })

        return result
      }
    )


    // return GenerateAudioFile, GenerateCaptions, GenerateImagePrompts, GenerateImages, UpdateDB
    // return UpdateDB
    return 'Executed Successfully!'
  }
)