const jwt_decode = require("jwt-decode");

function authMiddleware(req, res, next) {
    if (!req.headers["authorization"]) {
        res.status(401).json({
            status: false,
            message: "Unauthorized",
            data: [],
        });
        return;
    }
    const authorization_type = req.headers["authorization"].split(" ")[0];
    if (authorization_type != "Bearer") {
        res.status(401).json({
            status: false,
            message: "Unimplemented auth type",
            data: [],
        });
        return;
    } else if (authorization_type == "Bearer") {
        const decoded = jwt_decode(req.headers["authorization"].split(" ")[1]);
        if (decoded["user_id"] !== "undefined") {
            res.locals.auth = {
                user_id: decoded["user_id"],
            };
            next();
        } else {
            res.status(401).json({
                status: false,
                message: "Wrong token",
                data: [],
            });
            return;
        }
    }
}

module.exports = authMiddleware;
