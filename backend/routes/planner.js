// routes/planner.js

const express = require("express");
const router = express.Router();
const axios = require("axios"); // Use axios for all API calls for consistency
const auth = require("../middleware/auth");

// --- TRIP PLANNER ROUTE ---
router.post("/generate-plan", auth, async (req, res) => {
  try {
    const { travelStyle, month, locationType } = req.body;

    if (!travelStyle || !month || !locationType) {
      return res
        .status(400)
        .json({ msg: "Please provide all trip preferences." });
    }

    // This system instruction is now cleaner as we're telling the model to output JSON via the config
    const systemInstruction = `You are an expert travel planner. Based on the user's preferences, create a single, detailed travel plan for a 2-day trip. Your response MUST strictly follow the JSON structure provided.
    { "placeName": "...", "location": "...", "bestTimeToVisit": "...", "whyThisPlace": "...", "itinerary": [ { "day": 1, "title": "...", "activities": "..." }, { "day": 2, "title": "...", "activities": "..." } ] }`;

    const userPrompt = `My travel preferences are: Travel Style: ${travelStyle}, Month of Travel: ${month}, Type of Location: ${locationType}`;

    // FIX #3: Added generationConfig to enforce JSON output
    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not found in environment variables.");
    }

    // FIX #2: Corrected the model name to a valid one
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // Switched to axios for consistency
    const apiResponse = await axios.post(apiUrl, payload);

    // The response from Gemini with the JSON config is already parsed JSON, but it's inside a text field.
    const travelPlan = JSON.parse(
      apiResponse.data.candidates[0].content.parts[0].text
    );

    res.json(travelPlan);
  } catch (err) {
    // Improved error logging
    console.error(
      "Error in /generate-plan:",
      err.response ? err.response.data : err.message
    );
    res.status(500).send("Server Error while generating travel plan.");
  }
});

// --- IMAGE GENERATION ROUTE (No changes needed here, but included for completeness) ---
router.post("/generate-image", auth, async (req, res) => {
  const { placeName } = req.body;

  if (!placeName) {
    return res.status(400).json({ msg: "Place name is required." });
  }

  try {
    const engineId = "stable-diffusion-v1-6";
    const apiHost = "https://api.stability.ai";
    const apiKey = process.env.STABILITY_API_KEY;

    if (!apiKey) {
      throw new Error("Stability AI API key not found.");
    }

    const prompt = `A breathtaking, vibrant, photorealistic 16:9 landscape wallpaper of ${placeName}, suitable for a travel website hero banner. Epic, cinematic, stunning vista.`;

    const response = await axios.post(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 512,
        width: 1024,
        steps: 30,
        samples: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const image = response.data.artifacts[0];
    const imageUrl = `data:image/png;base64,${image.base64}`;

    res.json({ imageUrl });
  } catch (error) {
    console.error(
      "Error generating image from Stability AI:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Server error while generating image.");
  }
});

module.exports = router;
