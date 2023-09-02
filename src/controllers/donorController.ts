import { Request,Response,NextFunction, RequestHandler } from "express";
import prisma from "../utils/prisma_init";
import createHttpError from "http-errors";
import {generateHashPass} from '../utils/password_verify'




const createDonor: RequestHandler = async(req, res, next) => {
    try{
        const {name,phone_number,email, father_name, country, district, state, pincode,address,area_rep_id,subscription_plan_id,is_active} = req.body
        const hash = await generateHashPass(req)
        const donor =  await prisma.donor.create({data:{
            name: name,
            phone_number: phone_number,
            email: email,
            father_name: father_name,
            password: hash,
            country: country,
            district: district,
            state: state,
            pincode: pincode,
            address: address,
            area_rep_id: area_rep_id,
            subscription_plan_id: subscription_plan_id,
            is_active: is_active
        }})
        res.json(donor)
    }catch(error) {
        next(error)
    }
}
const getDonor =  async(req:Request, res:Response, next:NextFunction) => {
    try{
        var {search, limit, offset, sort, order} = req.query
        const orderBy = {[String(sort)]: order?'asc':'desc'};
        const page = (Number(offset)/Number(limit))+1
        var donor
        if(search) {
            search = String(search)
            donor = await prisma.donor.findMany({
                where:{
                    OR:[
                        { name: { contains: search}, },
                        { phone_number: { contains:  search} },
                        { id: { equals: isNaN(parseInt(search))?undefined:Number(search)}},
                    ]
                },
                orderBy,
                skip: offset?Number(offset):undefined,
                take: offset?Number(limit):undefined
            })
        }else{
            donor = await prisma.donor.findMany({
                orderBy,
                skip: offset?Number(offset):undefined,
                take: offset?Number(limit):undefined
            })
        }
        res.json({donor, "page":page?page:1})
    }catch(error){
        next(error)
    }
}
const getSingleDonor = async(req:Request, res:Response, next:NextFunction) => {
    const {id} = req.params
    try {
        const donor = await prisma.donor.findUnique({where:{id:Number(id)}})
        if(donor){
            res.json(donor)
        }else{
            res.send({"message":"account not present"}).status(404)
        }
    } catch (error) {
        next(error)
    }
}
const updateSingleDonor = async(req:Request, res:Response, next:NextFunction) => {
    const {id} = req.params
    res.send({"message":"account updated..."}).status(404)
}
const decativateDonorAccount = async(req:Request, res:Response, next:NextFunction) => {}
const getAreaRep = async(req:Request, res:Response, next:NextFunction) => {
    try{
        const {id} = req.params
        const donor = await prisma.donor.findUnique({where:{id:Number(id)}})    
        if(donor){
            if(donor.area_rep_id){
                const area_rep = await prisma.donor.findUnique({where:{id: donor.area_rep_id}})
                res.json(area_rep)
            }else{
                res.send({"message":"no area rep assigned"})
            }
        }else{
            res.send({"message":"account not found"}).status(404)
        }
    }catch(error){
        next(error)
    }
}
const completeDonorProfile = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {name, email, father_name, country,district,state,pincode,address} = req.body 

        var donor = await prisma.donor.findUnique({where:{id:req.user_id}})
        if(donor){
            if(donor.is_otp_verified) {
                donor =  await prisma.donor.update({
                    where:{id:req.user_id, is_otp_verified:true, is_active:true},
                    data:{
                        name:name,
                        email:email,
                        father_name:father_name,
                        country:country,
                        district:district,
                        state:state,
                        pincode:pincode,
                        address:address
                    }
                 })  
                res.json(donor)
            }else{
                //redirect to otp page
                res.send({'message': 'please verifiy otp, redirecting to otp page'})
            }
                 
        }else{
            next(createHttpError(404, 'account not found'))
        } 
        res.json(donor)
    } catch (error) {
        next(error)
    }
}
const updateLocation = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {pincode} = req.body 

        const donor =  await prisma.donor.update({
            where:{id:req.user_id,is_active:true},
            data:{pincode:pincode,}
         })  
        res.json(donor)
    } catch (error) {
        next(error)
    }
}
const updateLanguage = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {language} = req.body 

        const donor =  await prisma.donor.update({
            where:{id:req.user_id,is_active:true},
            data:{language:language,}
         })  
        res.json(donor)
    } catch (error) {
        next(error)
    }
}

export default {createDonor, getDonor,  getSingleDonor, updateSingleDonor, decativateDonorAccount, getAreaRep, completeDonorProfile, updateLocation, updateLanguage}