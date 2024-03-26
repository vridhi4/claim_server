const jwt = require('jsonwebtoken');
const secret = "secretisvridhi";
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    //console.log(authHeader);
    if(!authHeader)
    {
        return res.json({
            status:"auth header failed",
            message:"auth header not found"
        })
    }
    const [bearer, token] = authHeader.split(' ');
    if(bearer!== "Bearer" || !token)
    {
        return res.json({
            status: "token not found",
            message:"error occured while matching token"
        })
    }
    try{
        //decoded is a payload
        const decoded = jwt.verify(token, secret || '');
        //console.log({decoded});
        //decoded is a payload
        req.user = decoded.id ;
        next();
       
    } catch(err){
        return res.json({
            status: "401",
            message:"invalid token "
        })
    }
}

module.exports = authenticate;