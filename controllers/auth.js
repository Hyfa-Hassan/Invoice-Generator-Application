import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// User registration
export async function registerUser(req, res) {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        user = new User({ name, email, password });
        await user.save();

        const token = generateToken(user._id);
        return res.status(201).json({ message: 'Registration successful', token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

// User login
export async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        return res.json({ message: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}
