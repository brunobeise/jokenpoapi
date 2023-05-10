"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
function adminMiddleware(req, res, next) {
    const admpass = req.headers.admpass;
    if (admpass !== process.env.ADMPASS) {
        res.json({ message: "Unauthorized" });
        return;
    }
    next();
}
exports.adminMiddleware = adminMiddleware;
