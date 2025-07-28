const router = require("express").Router();
const Suggestion = require("../models/suggestion.model");
const auth = require("../middleware/auth");

// --- CREATE A NEW SUGGESTION ---
// @route   POST /api/suggestions
// @desc    Create a new travel suggestion
// @access  Private (only logged-in users can create one)
router.post("/", auth, async (req, res) => {
  try {
    const { title, location, description, image } = req.body;

    // Basic validation
    if (!title || !location || !description) {
      return res.status(400).json({ msg: "Please enter all required fields." });
    }
    const newSuggestion = new Suggestion({
      title,
      location,
      description,
      image,
      user: req.user.id,
    });

    // Save the suggestion to the database
    const savedSuggestion = await newSuggestion.save();

    res.status(201).json(savedSuggestion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/", async (req, res) => {
  try {
    const filter = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: "i" } },
            { location: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const suggestions = await Suggestion.find(filter)
      .populate("user", ["username"])
      .sort({ createdAt: -1 });

    res.json(suggestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
