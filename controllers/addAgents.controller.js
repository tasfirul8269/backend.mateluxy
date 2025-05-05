import Agent from "../models/agents.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/erros.js";

export const addAgents = async (req, res,next) => {

    const {username, fullName,profileImage, email,contactNumber,position, password} = req.body;

    const hashedPassword = await bcryptjs.hash(password, 10);

   const newAgent = new Agent({
        username: username,
        fullName: fullName,
        profileImage: profileImage,
        email: email,
        contactNumber: contactNumber,
        position: position,
        password: hashedPassword,
    });


    try {
        await newAgent.save();
        res.status(201).json('New Agent Has Been Added');
    } catch (error) {
        next(error);
    }
    


};