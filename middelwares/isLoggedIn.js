const jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next){
    
    if(req.cookies.token === "") res.redirect('/login');
    else{
        let data = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        req.user = data;
        next();
    }
}

module.exports.isLoggedIn = isLoggedIn