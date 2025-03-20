import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.userId = tokenDecode.id;  // ✅ Use `req.userId`, NOT `req.body.userId`
            req.userRole = tokenDecode.role;
            next();
        } else {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

const authorize = (roles) => {
    return async (req, res, next) => {
        try {
            const user = await userModel.findById(req.body.userId);
            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
            next();
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export { authMiddleware, authorize };