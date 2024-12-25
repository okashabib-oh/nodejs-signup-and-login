import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { generateToken } from "../utils/generateToken.js";

async function signup(req, res, next) {

    try {
        const { name, username, email, password } = req.body;

        if (name.trim() == "" || username.trim() == "" || email.trim() == "" || password.trim() == "") {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        // Username validation
        const isUsernameExist = await User.findOne({ username })
        if (isUsernameExist) {
            return res.status(400).json({ status: false, message: `username ${username} already exist please chooose different one` });
        }

        // Email validation
        const isEmailExist = await User.findOne({ email })
        if (isEmailExist) {
            return res.status(400).json({ status: false, message: `email ${email} already exist please chooose different one` });
        }

        // password validation
        if (password.length < 8) {
            return res.status(400).json({ status: false, message: "Password must be at least 8 characters long" });
        }

        const hashpassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name, username, email, password: hashpassword
        })
        newUser.save();

        return res.status(201).json({
            status: true,
            message: "User created successfully",
            userDetail: {
                name, username, email, password
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Catch error",
            error: error.message
        })
    }
}
async function login(req, res, next) {

    try {
        const { email, password } = req.body;

        if (email.trim() == "" || password.trim() == "") {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }
        let emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        if (!emailReg.test(email)) {
            return res.status(400).json({
                status: false,
                message: "Invalid email format"
            })
        }

        const emailCheck = await User.findOne({ email })

        if (!emailCheck) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, emailCheck.password);

        if (!passwordMatch) {
            return res.status(400).json({ status: false, message: "Invalid credentials" });
        }

        const user = await User.findOne({ email })

        const token = generateToken(user);

        return res.status(200).json({
            status: true, message: "Logged in successfully", data: {
                user,
                token
            }
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Catch error",
            error: error.message
        })
    }
}

export { signup, login };