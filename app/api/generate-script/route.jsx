import { generateScript } from "@/configs/AIModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { topic, title } = await req.json();
    const SCRIPT_PROMPT = `
        Generate two unique, concise scripts for a 30-second video based solely on the following details:
        Title: ${title}
        Topic: ${topic}

        Requirements:
        - Each script must be directly related to the provided title and topic.
        - Do NOT include any instructions or mentions of scenes, audio, music, or any production details—only the script text.
        - Output the result in strict JSON format using this schema:
        {
        "scripts": [
            { "content": "Script 1 content" },
            { "content": "Script 2 content" }
        ]
        }
        `;

    // console.log(SCRIPT_PROMPT);

    const result = await generateScript.sendMessage(SCRIPT_PROMPT);

    const resp = result?.response?.text();
    return NextResponse.json(JSON.parse(resp))
}