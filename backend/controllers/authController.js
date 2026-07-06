const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");    
const registerUser = async (req, res) => {
    try {

        // Get Data
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create New User
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        // Generate JWT Token
const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d",
    }
);
        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            token,
            user

        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const loginUser = async (req, res) => {
    try {

        // Get Data
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Compare Password
const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
    return res.status(400).json({
        message: "Invalid Password"
    });
}

// Generate JWT
const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d",
    }
);

res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    user,
});

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
    registerUser,
    loginUser,
};