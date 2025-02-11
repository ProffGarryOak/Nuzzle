import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        // Log the cookies to check if the token is present
        console.log('Cookies:', req.cookies);

        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        // Log the token to ensure it's being read correctly
        console.log('Token:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log the decoded token to check its contents
        console.log('Decoded Token:', decoded);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        // Log the user to ensure the user is found
        console.log('User:', user);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        // Log the error for debugging purposes
        console.log("Error in protectRoute middleware:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
