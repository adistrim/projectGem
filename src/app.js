const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const models = require("./models");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.use(express.static("public"));
app.use(bodyParser.json());

const chatSessions = {};

app.post("/chat", async (req, res) => {
    const selectedModel = req.body.model;
    const modelConfig = models[selectedModel];

    if (!modelConfig) {
        return res.status(400).json({ error: "Invalid model selected" });
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

    const userInput = req.body.input;
    const result = await chatSession.sendMessage(userInput);

    if (!chatSession.history) {
        chatSession.history = [];
    }

    chatSession.history.push({ input: userInput, response: result.response.text() });

    res.send(result.response.text());
});

app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});
