import User from '../Models/userModels.js';
import bcryptjs from 'bcryptjs'
import jwtwebToken from '../utils/jwtwebToken.js'

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;
        const user = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (user) return res.status(400).send({ success: false, message: "Username or Email Already Exist!.. " })
        const hashPassword = bcryptjs.hashSync(password, 10);
        const profileBoy = profilepic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        const profileGirl = profilepic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;


        const newUser = new User({
            fullname,
            username,
            email,
            gender,
            password: hashPassword,
            profilepic: gender === "male" ? profileBoy : profileGirl
        })

        if (newUser) {
            await newUser.save();
            jwtwebToken(newUser._id, res)
            return res.status(201).send({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                profilepic: newUser.profilepic,
                email: newUser.email,
            });
        } else {
            res.status(500).send({ success: false, message: "Invalid User Data" })
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);

    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) { return res.status(400).send({ success: false, message: "Email Doesn't Exist. Please Register" }) }
        const comparePass = bcryptjs.compareSync(password, user.password || "");
        if (!comparePass) { return res.status(500).send({ success: false, message: "Email or Password doesn't match" }) }

        jwtwebToken(user._id, res);

        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            success: true,
            message: "Successfully Logged in"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}

export const userLogout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })
        res.status(200).send({ message: "User Logged out" })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}