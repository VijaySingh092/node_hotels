// sets up passport with a local authentication strategy , using a Person model for use

const passport = require('passport');  // importing passport library for authentication
const LocalStrategy = require('passport-local').Strategy;  // import localStrategy which is  strategy for authentication
//The .Strategy part means you’re importing a class (or constructor function) called Strategy from the passport-local package.
//so in this code we’re just pulling out that Strategy function/class and giving it a name LocalStrategy in our code.



const Person =require('./models/person'); // adjust the path as needed



// passport.use() tells Password to use this strategy for login attempts
// SYNTAX :    passport.use(
//  new LocalStrategy(options, verifyCallback));
// options (optional): An object where you can define what fields to use. Example: { usernameField: 'email', passwordField: 'passwd' }
// verifyCallback: A function that gets called when someone tries to log in.
passport.use(new LocalStrategy(async (USERNAME,password,done)=>{
  // authentication logic here
  try{
    //console.log('Received credentials:',USERNAME,password);
    const user = await Person.findOne({username: USERNAME}); // Looks up the user in the database by their username
if(!user)   // this condition only triggers when the username doesn’t exist in the database.
//The done function is part of Passport’s contract for a verify callback.
// Its signature is:    done(error, user, info)
  return done(null,false,{message:'Incorrect username'});


//user is a database record that represent a single user.it contains the user's hashed password
// comparePassword(password) – This is a method defined on the user object that:

//Takes the password that the user just typed in (plain text).
//Compares it against the stored hashed password using a hashing algorithm (usually bcrypt).
//Returns true if the password matches the hash, false if it does not.
  const isPasswordMatch = await user.comparePassword(password);   // returns true or false

  if(isPasswordMatch){
    // done is a callback function provided by Passport to signal the result of authentication
    //Syntax:  done(error, user, info)
//error → system error (e.g., DB connection failed). null here because there’s no error.
//user → authenticated user object (if login succeeds).
//info → optional object with messages. Not needed here because login succeeded.
    return done(null,user);
  }else{
    return done(null,false,{message:'Incorrect password.'});
  }

  }catch(err){
    return done(err);
  }
}));

module.exports = passport;