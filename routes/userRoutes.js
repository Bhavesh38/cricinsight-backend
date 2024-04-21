import express from "express";
import Users from "./../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import { validateEmail, validatePassword } from "../utils/userUtil.js";
const router = express.Router();
router.post("/register", async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ message: "Invalid password" });
        }

        /// OTP Verification Start ///
        // const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'bhavesh.connect38@gmail.com',
        //         pass: 'jrea sdsm ayol cteh'
        //     }
        // });

        // // Email options
        // const mailOptions = {
        //     from: 'bhavesh.connect38@gmail.com',
        //     to: email,
        //     subject: 'OTP Verification',
        //     text: `Your OTP is: ${otp}`
        // };

        // // Send email
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.log('Error sending email:', error);
        //         res.status(500).json({ message: 'Error sending OTP email' });
        //     } else {
        //         console.log('Email sent:', info.response);
        //         res.status(200).json({ message: 'OTP sent successfully' });
        //     }
        // });
        /// OTP Verification End ///

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({
            email: email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: "SUCCESS" });
    } catch (error) {
        return next(error);
    }
});


router.post('/login', async (req, res, next) => {
    const { email, password, rememberMe } = req.body;
    try {
        const user = await Users.findOne({
            email: email,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ email: email },'mysecretkey', { expiresIn: rememberMe ? "1h" : "1h" });
        res.status(200).json({ message: "SUCCESS", token: token, expiresIn: rememberMe ? "1h" : "1h" });
    } catch (error) {
        return next(error);
    }
});

// getalluser
router.get("/getallusers", async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


export default router;






