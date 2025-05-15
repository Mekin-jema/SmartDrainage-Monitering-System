import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        // verify the token
        const decode = jwt.verify(token, process.env.API_SECRET);
        // check if decoding was successful
        if (!decode) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",error: error.message
        });
    }
};
