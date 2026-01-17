import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Use memory storage for uploaded files
const upload = multer({ storage: multer.memoryStorage() });

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend server is running. Use /ping or /ocr routes.");
});

app.get("/ping", (req, res) => {
    res.send("pong");
});

// OCR route
app.post("/ocr", upload.single("image"), async (req, res) => {
    console.log("Received file:", req.file);

    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
    }

    // Convert to base64 and log its length
    const imageBase64 = req.file.buffer.toString("base64");
    console.log("Image size (base64):", imageBase64.length);

    try {
        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    inlineData: {
                                        data: imageBase64,
                                        mimeType: "image/jpeg",
                                    },
                                },
                                {
                                    text: "Extract all readable text from this image. Preserve line breaks."
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        const data = await response.json();
        const candidate = data?.candidates?.[0];
        const extractedText = candidate?.content?.parts?.map(p => p.text).join("\n") || "";
        res.json({ text: extractedText });
    } catch (err) {
        console.error("OCR route error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


// --- Start server ---
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
