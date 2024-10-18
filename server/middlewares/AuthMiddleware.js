import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // console.log("Cookies : " ,req.cookies)
    const token = req.cookies.jwt;
    if (!token) return res.status(401).send("Ypu are not authenticated");

    jwt.verify(
        token,
        process.env.JWT_KEY,
        async (err, payload) => {
            if (err) return res.status(403).send("Token is not vaild");
            req.userId = payload.userId;
            next();
        })
    // console.log("VerifyToken : ",token);

};