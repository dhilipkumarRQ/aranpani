import  {Request,Response,NextFunction} from 'express'
import prisma from '../utils/prisma_init'
import {generateHashPass} from '../utils/password_verify'

const createAdmin = async(req:Request,res:Response,next:NextFunction)  => {

    try {
        const {email,name,phone_number} = req.body
        const hash = await generateHashPass(req)
        const admin = await prisma.user.create({
            data: {email:email, name:name, phone_number:phone_number, password:hash,role:'admin', otp:1111}
        })
        res.json(admin) 
    } catch (error) {
        next(error)
    }

} 

export default {createAdmin}