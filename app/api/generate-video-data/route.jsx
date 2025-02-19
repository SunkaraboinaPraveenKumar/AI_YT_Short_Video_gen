import { inngest } from "@/inngest/client"
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const {formData, recordId, audioUrl} = await req.json();

        const result = await inngest.send({
            name: 'generate-video-data',
            data: {
                ...formData,
                recordId,
                audioUrl
            }
        });

        return NextResponse.json({ result });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
