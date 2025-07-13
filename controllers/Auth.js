const bcrypt = require('bcrypt');
const User = require("../models/User");
const jwt = require("jsonwebtoken");

//signup route handler: -->
exports.signup = async (req, res) => {
    try {
        //get data:
        const {name, email, password, role} = req.body;
        //check if user already exists??
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json(
                {
                    success: false,
                    message: "User already exists"
                }
            );
        }
        //secure password: 
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: "Error in encrypting password"
            })
        }

        //create entry for user:
        const user = await User.create({
            name, email, password: hashedPassword, role
        })

        res.status(200).json({
            success: true,
            message: "User created successfully"
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again later"
        })
    }
}

//login handler:
exports.login = async (req, res) => {
    try {
        //data fetch: 
        const {email, password} = req.body;
        //validation on email & password:
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill all details carefully"
            });
        }

        let user = await User.findOne({email});
        if(!user){  
            return res.status(401).json({
                success: false,
                message: "User is not registered"
            })
        }
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        };
        //verify password and generate a jwt token:-->
        if(await bcrypt.compare(password, user.password)){
            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged in successfully"
            })
        }
        
        return res.status(403).json({
            success: false,
            message: "Password incorrect"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure"
        })
    }
}