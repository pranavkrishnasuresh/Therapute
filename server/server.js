const express = require("express");
const cors = require("cors");
const OpenAI = require("openai").OpenAI;
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());

app.post('/generate-response', async (req, res) => {
    const { prompt } = req.body;

    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const GPTresponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: prompt,
                }
            ],
            max_tokens: 10,
        });


        res.status(200).json({ success: true, message: "Response generated successfully", response: GPTresponse.choices[0].message.content });
        console.log(JSON.stringify(GPTresponse.choices[0].message.content));

    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ success: false, message: "Error generating response", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
