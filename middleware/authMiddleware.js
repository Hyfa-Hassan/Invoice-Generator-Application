import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const bearer = token.split(" ");
        const bearerToken = bearer[1];
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decoded;
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;