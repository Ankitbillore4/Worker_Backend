const authMiddleware = (req, res, next) => {
    console.log("Auth Middleware Triggered");
    next();
};
 
module.exports = authMiddleware;
