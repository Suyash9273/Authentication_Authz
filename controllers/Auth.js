const bcrypt = require('bcrypt');
const User = require("../models/User");

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