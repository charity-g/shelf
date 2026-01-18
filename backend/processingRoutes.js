import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import fetch from "node-fetch";

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });

export const processingRouter = express.Router(); // namespace processingRouter
processingRouter.get("/", (req, res) => {
  res.send("Backend server is running. Use /ping or /ocr routes.");
});

processingRouter.get("/ping", (req, res) => {
  res.send("pong");
});

// OCR route
processingRouter.post("/ocr", upload.single("image"), async (req, res) => {
  console.log("=== OCR Request Debug ===");
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body keys:", Object.keys(req.body || {}));
  console.log("Received file:", req.file);
  console.log("=========================");

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

Return ONLY valid JSON without markdown code blocks or extra text.`,
            },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: imageBase64,
              },
            },
          ],
        },
      ],
    };

    const ocrResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
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
        statusCode: ocrResponse.status,
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
        details: responseText.substring(0, 500), // First 500 chars
      });
    }

    const extractedText =
      ocrData?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ||
      "";

    if (!extractedText) {
      console.log("Full API response:", JSON.stringify(ocrData, null, 2));
      return res.status(400).json({
        error: "No text could be extracted from the image",
        apiResponse: ocrData,
      });
    }

    console.log("Extracted text:", extractedText);

    // Parse the JSON response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      const cleanJson = extractedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return res.json({
        rawText: extractedText,
        error: "Could not parse structured data as JSON",
      });
    }

    res.json({
      rawText: extractedText,
      structuredData: parsedData,
    });
  } catch (err) {
    console.error("OCR route error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

// =====================================================
// COMPARE PAGE ENDPOINTS (Placeholder with mock data)
// =====================================================

// Mock product database with ingredients
const mockProductsDB = {
  1: {
    id: "1",
    name: "Gentle Foaming Cleanser",
    brand: "CeraVe",
    category: "Cleanser",
    ingredients: [
      "Ceramides",
      "Hyaluronic Acid",
      "Niacinamide",
      "Glycerin",
      "Cholesterol",
    ],
  },
  2: {
    id: "2",
    name: "Soy Face Cleanser",
    brand: "Fresh",
    category: "Cleanser",
    ingredients: [
      "Soy Proteins",
      "Cucumber Extract",
      "Rose Water",
      "Aloe Vera",
      "Amino Acids",
    ],
  },
  3: {
    id: "3",
    name: "Facial Treatment Essence",
    brand: "SK-II",
    category: "Toner",
    ingredients: [
      "Pitera",
      "Galactomyces Ferment Filtrate",
      "Butylene Glycol",
      "Sodium Benzoate",
    ],
  },
  4: {
    id: "4",
    name: "Hyaluronic Acid 2% + B5",
    brand: "The Ordinary",
    category: "Serum",
    ingredients: [
      "Hyaluronic Acid",
      "Vitamin B5",
      "Sodium Hyaluronate",
      "Pentylene Glycol",
    ],
  },
  5: {
    id: "5",
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "Serum",
    ingredients: [
      "Niacinamide",
      "Zinc PCA",
      "Tamarindus Indica Seed Gum",
      "Isoceteth-20",
    ],
  },
  6: {
    id: "6",
    name: "Moisturizing Cream",
    brand: "CeraVe",
    category: "Moisturizer",
    ingredients: [
      "Ceramides",
      "Hyaluronic Acid",
      "Petrolatum",
      "Glycerin",
      "Dimethicone",
    ],
  },
  7: {
    id: "7",
    name: "UV Aqua Rich Watery Essence",
    brand: "Biore",
    category: "Sunscreen",
    ingredients: [
      "Octinoxate",
      "Zinc Oxide",
      "Hyaluronic Acid",
      "Royal Jelly Extract",
      "Citrus Extract",
    ],
  },
};

// Get all user products
processingRouter.get("/products", (req, res) => {
  const products = Object.values(mockProductsDB).map(
    ({ id, name, brand, category }) => ({
      id,
      name,
      brand,
      category,
    }),
  );
  res.json(products);
});

// Get product details with ingredients
processingRouter.get("/products/:id/details", (req, res) => {
  const { id } = req.params;
  const product = mockProductsDB[id];

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

// Get similar products based on shared ingredients
processingRouter.get("/products/:id/similar", (req, res) => {
  const { id } = req.params;
  const product = mockProductsDB[id];

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const productIngredients = new Set(
    product.ingredients.map((i) => i.toLowerCase()),
  );

  // Find similar products by comparing ingredients
  const similarProducts = Object.values(mockProductsDB)
    .filter((p) => p.id !== id)
    .map((p) => {
      const otherIngredients = p.ingredients.map((i) => i.toLowerCase());
      const sharedIngredients = p.ingredients.filter((i) =>
        productIngredients.has(i.toLowerCase()),
      );
      const matchPercentage = Math.round(
        (sharedIngredients.length /
          Math.max(product.ingredients.length, p.ingredients.length)) *
          100,
      );

      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        matchPercentage,
        sharedIngredients,
      };
    })
    .filter((p) => p.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  res.json(similarProducts);
});

// Search products by name or brand
processingRouter.get("/products/search", (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json(Object.values(mockProductsDB));
  }

  const query = q.toLowerCase();
  const results = Object.values(mockProductsDB).filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query),
  );

  res.json(results);
});
