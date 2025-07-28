const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')

// Register

router.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({
                message: 'Please enter all fields.'
            })
        }

        const existingUser = await User.findOne({
            $or:[{email}, {username}]
        })
        if(existingUser) {
            return res.status(400).json({
                message: 'User with this email or username already exists'
            })
        }

        const newUser = new User({
            username,
            email,
            password
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        const savedUser = await newUser.save();

        res.status(201).json({
            message: 'User registered successfully!',
            user: {
                id: savedUser.id,
                username: savedUser.username,
                email: savedUser.email
            }
        })
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


// Login

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                message: 'Please enter all fields'
            });
        }
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                message: 'Invalid credentials. User not found.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials. Password incorrect.'
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 3600}, (err, token) => {
            if(err) throw err;
            res.status(200).json({
                message: 'User logged in successfully',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        });
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// get profile
router.get('/profile', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.json(user);
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send("Server error")
    }
})

module.exports = router;