import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import models from "@/models/models";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const chatSessions = {};

export async function POST(req) {
    const selectedModel = await req.json().then((data) => data.model);
    const modelConfig = models[selectedModel];

    if (!modelConfig) {
        return new Response(JSON.stringify({ error: "Invalid model selected" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const { generationConfig, safetySettings } = modelConfig;

    let chatSession = chatSessions[selectedModel];

    if (!chatSession) {
        const model = genAI.getGenerativeModel({ model: selectedModel });
        chatSession = model.startChat({ generationConfig, safetySettings, history: [] });
        chatSessions[selectedModel] = chatSession;
        console.log(`New chat session created for model: ${selectedModel}`);
    } else {
        console.log(`Existing chat session found for model: ${selectedModel}`);
    }

    const userInput = (await req.json()).input;
    const result = await chatSession.sendMessage(userInput);

    if (!chatSession.history) {
        chatSession.history = [];
    }

    chatSession.history.push({ input: userInput, response: result.response.text() });

    return new Response(result.response.text(), {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    });
}