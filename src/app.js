const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

app.use(express.static('public'));
app.use(bodyParser.json());

const generationConfig = { temperature: 1, topP: 0.95, topK: 64, maxOutputTokens: 8192, responseMimeType: "text/plain" };
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }
];
const chatSession = model.startChat({ generationConfig, safetySettings, history: [] });

app.post('/chat', async (req, res) => {
    const userInput = req.body.input;
    const result = await chatSession.sendMessage(userInput);
    res.send(result.response.text());
});

app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});
