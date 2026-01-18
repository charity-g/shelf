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

    // Convert to base64
    const imageBase64 = req.file.buffer.toString("base64");
    console.log("Image size (base64):", imageBase64.length);
    console.log("MIME type:", req.file.mimetype);

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        console.log("Calling Gemini API...");

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: `Analyze this skincare product image and extract the information in the following JSON format:

{
  "name": "product name",
  "type": "one of: cleanser, toner, exfoliant, serum, moisturizer, sunscreen, mask, other",
  "ingredients": ["ingredient1", "ingredient2", ...],
  "skinType": "one of: oily, dry, combination, acne prone, sensitive, normal, all",
  "timeOfDay": "one of: day, night, both"
}

Return ONLY valid JSON without markdown code blocks or extra text.`
                        },
                        {
                            inlineData: {
                                mimeType: req.file.mimetype,
                                data: imageBase64
                            }
                        }
                    ]
                }
            ]
        };

        const ocrResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        console.log("Response status:", ocrResponse.status);
        console.log("Response headers:", Object.fromEntries(ocrResponse.headers));

        // Get response text first for debugging
        const responseText = await ocrResponse.text();
        console.log("Response body:", responseText);

        if (!ocrResponse.ok) {
            console.error("API error response:", responseText);

            // Try to parse as JSON for better error message
            let errorMessage = responseText;
            try {
                const errorJson = JSON.parse(responseText);
                errorMessage = errorJson.error?.message || responseText;
            } catch (e) {
                // Keep original text if not JSON
            }

            return res.status(ocrResponse.status).json({
                error: "OCR extraction failed",
                details: errorMessage,
                statusCode: ocrResponse.status
            });
        }

        // Parse successful response
        let ocrData;
        try {
            ocrData = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse response as JSON:", e);
            return res.status(500).json({
                error: "Invalid response from API",
                details: responseText.substring(0, 500) // First 500 chars
            });
        }

        const extractedText = ocrData?.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") || "";

        if (!extractedText) {
            console.log("Full API response:", JSON.stringify(ocrData, null, 2));
            return res.status(400).json({
                error: "No text could be extracted from the image",
                apiResponse: ocrData
            });
        }

        console.log("Extracted text:", extractedText);

        // Parse the JSON response
        let parsedData;
        try {
            // Remove markdown code blocks if present
            const cleanJson = extractedText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            parsedData = JSON.parse(cleanJson);
        } catch (parseError) {
            console.error("JSON parsing error:", parseError);
            return res.json({
                rawText: extractedText,
                error: "Could not parse structured data as JSON"
            });
        }

        res.json({
            rawText: extractedText,
            structuredData: parsedData
        });

    } catch (err) {
        console.error("OCR route error:", err);
        console.error("Error stack:", err.stack);
        res.status(500).json({
            error: "Internal server error",
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
    console.log(`API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});