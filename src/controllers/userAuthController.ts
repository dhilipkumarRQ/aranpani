import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma_init";
import { generateHashPass , comparePassword} from "../utils/password_verify";
import createHttpError from "http-errors";
import { OTP } from "../config";
import {generateToken}  from "../utils/jwt_token";
import { Roles } from "../config";


const login = async (req: Request, res: Response, next:NextFunction) => {
    const {phone_number, password, email, role} = req.body
    if(role == Roles.ADMIN || role == Roles.SUPER_ADMIN) {
        if(!email) {
            return next(createHttpError(422, 'cannot proceess the request'))
        }
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })
        if(!user) {
            return next(createHttpError.Conflict('admin account not present'))
        }
        const isMatch:boolean = await comparePassword(password, user.password)
        if(isMatch) {
            var token
            if(user.role == Roles.ADMIN){
                token = await generateToken(user, Roles.ADMIN)
            }else{
                token = await generateToken(user, Roles.SUPER_ADMIN)
            }
            res.send({"access_token": token})
        }else{
            next(createHttpError(422, 'password is incorrect'))
        }
    }else if(role == Roles.DONOR || role == Roles.AREA_REP) {
        if(!phone_number) {
            return next(createHttpError(422, 'cannot proceess the request'))
        }
        const user = await prisma.donor.findUnique({
                    where: {
                        phone_number: phone_number,
                        is_active: true
                    }
                })
        if(!user) {
            return next(createHttpError.Conflict('donor account not present'))
        }
        if(!user.is_otp_verified) {
            return next(createHttpError.Forbidden('please verify otp'))
        } 
        const isMatch:boolean = await comparePassword(password, user.password)
        if(isMatch) {
            var token
            if(user.area_rep_id == null){
                token = await generateToken(user, Roles.DONOR)
            }else{
                token = await generateToken(user, Roles.AREA_REP)
            }
            res.send({"access_token": token})
        }else{
            next(createHttpError(422, 'password is incorrect'))
        }
    }else{
        next(createHttpError(422,'incorrect role')) 
    }
    
}

const signup = async (req: Request, res: Response, next:NextFunction) => {
    const {phone_number, password, confirm_password} = req.body
    if(password != confirm_password) {
        next(createHttpError(422, 'password and confirm password mismatch'))
    }
    const isDonorExist = await prisma.donor.findUnique({
        where: {
            phone_number: phone_number
        }
    })
    if(isDonorExist) {
        return next(createHttpError.Conflict('donor with this phone number is already present'))
    }
    const hash = await generateHashPass(req)
    try {
        const donor = await prisma.donor.create({
            data: {
                phone_number: req.body.phone_number,
                password: hash,
                otp: OTP
            }
        }) 
        res.json(donor) 
    } catch (error:any) {
        next(error)
    }
}

const verify_otp = async (req: Request, res: Response, next:NextFunction) => {
    const donor = await prisma.donor.findUnique({where: {id: req.user_id}})
    if (donor) {
        if (donor.otp == req.body.otp) {
            await prisma.donor.update({
                where: {
                    id: req.user_id
                },
                data: {
                    is_otp_verified: true,
                } 
            })
            var token
            if(donor.area_rep_id == null){
                token = await generateToken(donor, Roles.DONOR)
            }else{
                token = await generateToken(donor, Roles.AREA_REP)
            }
            return res.json({"message":'otp verification successful',
                            "token":token})
        }else{
            return next(createHttpError(400,'otp incorrect'))
        }
    }
    next(createHttpError(404,'user account not present'))
}

const forgot_password = async (req: Request, res: Response,  next:NextFunction) => {
   
    if (req.body.role == Roles.DONOR) {
        const donor = await prisma.donor.findUnique({where: { phone_number: req.body.phone_number}})
        if (donor) {
            // send otp to number
            return res.send({"message": "otp send to phone number"})
        }else{
            next(createHttpError(404,'donor account not present'))
        }
    }else if(req.body.role == Roles.ADMIN) {
        const admin = await prisma.user.findUnique({where: { phone_number: req.body.phone_number}})
        if (admin) {
            // send otp to email
            return res.send({"message": "otp send to email"})
        }else{
            next(createHttpError(404,'admin account not present'))
        }
    }
    next(createHttpError(422,'incorrect role'))
}

const reset_password = async (req: Request, res: Response, next:NextFunction) => {
    if (req.body.password != req.body.confirm_password) {
        next(createHttpError(422,'confirm password mismatch'))
    }
    const hash = await generateHashPass(req)
    if(req.role == Roles.DONOR || req.role == Roles.AREA_REP){
        const donor = await prisma.donor.findUnique({where: { id: req.user_id}})
        if (donor) {
            await prisma.donor.update({where: {id:req.user_id}, data:{password:hash}})
            return res.send({"message": "password updated successfully"})
        }else{
            next(createHttpError(404,'donor account not present'))
        }
    }else if(req.role == Roles.ADMIN || req.role == Roles.SUPER_ADMIN){
        const admin = await prisma.user.findUnique({where: { id: req.user_id}})
        if (admin) {
            await prisma.user.update({where: {id:req.user_id}, data:{password:hash}})
            return res.send({"message": "password updated successfully"})
        }else{
            next(createHttpError(404,'admin account not present'))
        }
    }
    next(createHttpError(422,'incorrect role'))
}

const change_password = async(req: Request, res: Response, next:NextFunction) => {

    const hash = await generateHashPass(req)
    if(req.role == Roles.DONOR || req.role == Roles.AREA_REP){
        const donor:any = await prisma.donor.findUnique({where: { id: req.user_id}})
        const isMatch:boolean = await comparePassword(req.body.password, donor.password)
        if(isMatch){
            if (donor) {
                await prisma.donor.update({where: {id:req.user_id}, data:{password:hash}})
                return res.send({"message": "password updated successfully"})
            }else{
                next(createHttpError(404,'donor account not present'))
            }
        }else{
            next(createHttpError(422, 'password is incorrect'))
        }
    }else if(req.role == Roles.ADMIN || req.role == Roles.SUPER_ADMIN){
        const admin:any = await prisma.user.findUnique({where: { id: req.user_id}})
        const isMatch:boolean = await comparePassword(req.body.password, admin.password)
        if(isMatch){
            if (admin) {
                await prisma.user.update({where: {id:req.user_id}, data:{password:hash}})
                return res.send({"message": "password updated successfully"})
            }else{
                next(createHttpError(404,'admin account not present'))
            }
        }else{
            next(createHttpError(422, 'password is incorrect'))
        }
        
    }
    next(createHttpError(422,'incorrect role'))
}

export default {login, signup,verify_otp,forgot_password,reset_password,change_password}