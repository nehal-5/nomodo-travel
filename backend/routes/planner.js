const router = require('express').Router();
const auth = require('../middleware/auth');

// --- TRIP PLANNER ROUTE ---
// @route   POST /api/planner/generate-plan
// @desc    Generate a detailed travel plan using AI
// @access  Private
router.post('/generate-plan', auth, async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const { travelStyle, month, locationType } = req.body;

    if (!travelStyle || !month || !locationType) {
      return res.status(400).json({ msg: 'Please provide all trip preferences.' });
    }

    // --- System Instruction for the AI ---
    // This detailed instruction guides the AI to generate a structured itinerary.
    const systemInstruction = `You are an expert travel planner for India, and also around the world. Your suggestions should be creative, engaging, and tailored to the user's interests based on their prompt.
    Based on the user's preferences, create a single, detailed travel plan for a 2-day trip.
    Your response MUST be a valid JSON object with the following structure and nothing else:
    {
      "placeName": "Name of the suggested location",
      "location": "City, State",
      "bestTimeToVisit": "A brief note on the best time to visit this specific place",
      "whyThisPlace": "A compelling paragraph explaining why this place matches the user's preferences.",
      "itinerary": [
        {
          "day": 1,
          "title": "A catchy title for Day 1 (e.g., Arrival and Local Exploration)",
          "activities": "A detailed description of the activities for Day 1, written as a single paragraph."
        },
        {
          "day": 2,
          "title": "A catchy title for Day 2 (e.g., Nature and Departure)",
          "activities": "A detailed description of the activities for Day 2, written as a single paragraph."
        }
      ]
    }
    Do not include any other text, explanations, or markdown formatting like \`\`\`json. Only the raw JSON object.`;

    const userPrompt = `My travel preferences are:
    - Travel Style: ${travelStyle}
    - Month of Travel: ${month}
    - Type of Location: ${locationType}`;

    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: `System Instruction: ${systemInstruction}\n\nUser Prompt: ${userPrompt}` }]
      }]
    };
    
    const apiKey = process.env.GEMINI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!apiResponse.ok) {
      throw new Error(`Gemini API responded with status: ${apiResponse.status}`);
    }

    const result = await apiResponse.json();

    if (result.candidates && result.candidates[0].content.parts[0].text) {
      let aiText = result.candidates[0].content.parts[0].text;
      const cleanedText = aiText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
      const travelPlan = JSON.parse(cleanedText);
      res.json(travelPlan);
    } else {
      throw new Error('Unexpected response format from AI service.');
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error while generating travel plan.');
  }
});

module.exports = router;