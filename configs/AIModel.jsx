const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};


export const generateScript = model.startChat({
    generationConfig,
    history: [

    ],
});

export const GenerateImageScript = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "Generate Image prompt of cinematic style with all details for each scene for 30 seconds video: script :\n\"AI is transforming the world of transportation! Self-driving cars, optimized logistics, and smarter traffic management are just the beginning. AI is making transportation safer, more efficient, and more sustainable. Get ready for a future where AI-powered transportation connects us all! AI is the way to go!\"\n\n-No need of intro before response directly generate also no mentions about\nI am currently unable to generate images directly, as that capability is limited to early testers. However, I can provide you with the image prompts as requested based on your script.\n\nJust Give specifing image prompt depending on the story line\n\n-donot give camera angle image prompt\n\nFollow the following schema and return JSON data(Max 4-5 Images)\n-[\n{\nimagePrompt:'',\nsceneContent:'<Script Content>'\n}\n]" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n[\n  {\n    \"imagePrompt\": \"A sleek, modern self-driving car navigating a futuristic cityscape at sunset. The car is surrounded by holographic displays and other autonomous vehicles. Focus on the car's sensors and the seamless integration with the smart city infrastructure.\",\n    \"sceneContent\": \"AI is transforming the world of transportation! Self-driving cars...\"\n  },\n  {\n    \"imagePrompt\": \"A vast network of delivery drones efficiently moving packages across a bustling city. Show the drones utilizing AI to optimize their routes and avoid obstacles, highlighting the speed and precision of AI-powered logistics.\",\n    \"sceneContent\": \"...optimized logistics...\"\n  },\n  {\n    \"imagePrompt\": \"A real-time traffic management system displayed on a large screen in a control room. Show AI algorithms analyzing traffic patterns and dynamically adjusting signals to minimize congestion and improve flow. Include visualizations of data and predictive analytics.\",\n    \"sceneContent\": \"...and smarter traffic management are just the beginning.\"\n  },\n  {\n    \"imagePrompt\": \"A split-screen montage: On one side, show a crash scene from the past; on the other, show a self-driving car safely avoiding a similar scenario with AI. Emphasize the safety benefits of AI-powered transportation.\",\n    \"sceneContent\": \"AI is making transportation safer...\"\n  },\n  {\n    \"imagePrompt\": \"A futuristic, sustainable transportation hub with electric vehicles charging, solar panels generating energy, and green spaces integrated into the design. Showcase the environmental benefits of AI in transportation.\",\n    \"sceneContent\": \"...more efficient, and more sustainable.\"\n  },\n    {\n    \"imagePrompt\": \"A diverse group of people connecting and interacting seamlessly through AI-powered transportation options – from ride-sharing to public transit. Capture the feeling of interconnectedness and accessibility.\",\n    \"sceneContent\": \"Get ready for a future where AI-powered transportation connects us all! AI is the way to go!\"\n  }\n]\n```" },
            ],
        },
    ],
});