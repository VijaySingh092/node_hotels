const jwt= require('jsonwebtoken');   //jsonwebtoken is a Node.js library used to create and verify JWT tokens.



// middleware
const jwtAuthMiddleware=(req,res,next)=>{ // express middleware function . middleware in express runs between the request and the final response.
    // first check request headers has authorization or not 
    //reades the authorization header from the request and saves it into a variable called authorization
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({error: 'Token not found'});// if the client didn't send the authorization header, authorization will be undefined. This means the request didn't even try to authenticate

    // extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1]; //split(' ') splits the string into an array at the space . [1] takes the second item(index 1)- the actual JWT token . now token holds just he raw JWT token (without "Bearer")
    if(!token) return req.status(401).json({error: 'Unauthorized'}); // if for some reason no token was found after splitting then it immediately sends back with 401 status code(unauthorized request)
    
    try{
        // verify token
        const decoded=jwt.verify(token,process.env.JWT_SECRET);  // this 3 things checks signature , checks expiration and decodes the payload


        //attach user information to the request object
        req.user = decoded; // saves the decoded payload inside req.user// this means anywhere later in ypur request pipeline , you can access: req.user.id, req.user.email
        next(); // this tells Express : This middleware is done, pass control to the next middleware or the route handler. // without next() the request would get stuck and never reach your route

    }catch(err){   // if the token is missing expired tampered with(signature mismatch) jwt.verify throws an error
        console.error(err);
        res.status(401).json({error:'Invalid token'});
    }
}

// Function to generate JWT token
const generateToken =(userData)=>{  // a helper function that takes some userData (like {id,email}) as input //this data will be stored inside the JWT payload
    // generate a new JWT token using user data
    // syntax: jwt.sign(payload, secret, options) this generates a jwt token
    // userData → the payload (data you want to include in the token).
    //Example: { id: 1, email: "test@example.com" }
    //process.env.JWT_SECRET → the secret key (from your .env file).
//Used to digitally sign the token.
//The same secret is required to verify it later.
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:3000});
}

module.exports= {jwtAuthMiddleware,generateToken} // export both jwtAuthMiddleware and generateToken