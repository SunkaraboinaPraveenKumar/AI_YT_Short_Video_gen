import { generateScript } from "@/configs/AIModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { topic, title } = await req.json();

    const SCRIPT_PROMPT = `
    write a two different scripts for a 30sec video with Title:${title} on Topic: ${topic},
    Give me response in JSON format and following schema.
    In schema content should be direct script data no need to mention scene, audio etc.. attributes just needed script to convert to audio file and then generate captions accordingly.
    {
        scripts:[
            {
                content:""
            }
        ]
    }
    `
    const result = await generateScript.sendMessage(SCRIPT_PROMPT);

    const resp = result?.response?.text();
    return NextResponse.json(JSON.parse(resp))
}