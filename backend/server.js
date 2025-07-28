const express = require("express");
const cors = require("cors"); // for react to communicate
const mongoose = require("mongoose"); // mongodb connection

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
if(!uri) {
    console.error("ATLAS_URI is not defined. Please check your .env file");
    process.exit(1);
}
mongoose.connect(uri).then(() => console.log("MongoDB database connection established successfully")).catch((err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
})

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const suggestionsRouter = require('./routes/suggestions');
app.use('/api/suggestions', suggestionsRouter);

app.use('/api/ai', require('./routes/ai'));
app.use('/api/planner', require('./routes/planner'));

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Nomodo API! Server is up and running"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});