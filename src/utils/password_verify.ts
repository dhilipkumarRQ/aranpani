import bcrypt from "bcrypt";
import {Request } from "express";
const saltRounds = 10;

export const generateHashPass = async (req: Request) => {
    const password  = req.body.password
    const hashPass  =  await bcrypt.hash(password, saltRounds)
    return hashPass
}


export const comparePassword = async (password:string, user_password:string ):Promise<boolean> => {
    const match = await bcrypt.compare(password, user_password)
    return match
}

