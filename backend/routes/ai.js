const router = require("express").Router();
const auth = require("../middleware/auth");

router.post('/generate-suggestion', auth, async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ msg: 'Please provide a prompt for the AI.' });
    }

    const systemInstruction = `You are a helpful travel assistant specializing in suggesting unique and interesting places to visit, with a focus on locations in India, and also around the world. Your suggestions should be creative, engaging, and tailored to the user's interests based on their prompt.
    The user will provide a prompt. Based on the prompt, suggest a single, specific travel destination.
    Your response MUST be a valid JSON object with the following structure and nothing else:
    {
      "title": "A creative and catchy title for the suggestion",
      "location": "The specific location (e.g., City, State)",
      "description": "A detailed, engaging, and helpful description of the place and why it's a good suggestion (at least 2-3 sentences)."
    }
    Do not include any other text, explanations, or markdown formatting like \`\`\`json. Only the raw JSON object.`;
    
    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: `System Instruction: ${systemInstruction}\n\nUser Prompt: ${prompt}` }]
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
      
      const aiSuggestion = JSON.parse(cleanedText); // Parse the cleaned string
      aiSuggestion.isAi = true;
      
      res.json(aiSuggestion);
    } else {
      throw new Error('Unexpected response format from AI service.');
    }

  } catch (err) {
    console.error(err);
    if (err instanceof SyntaxError) {
      return res.status(500).send('Error parsing AI response. The AI may have returned invalid JSON.');
    }
    res.status(500).send('Server Error while contacting AI service.');
  }
});

module.exports = router;
