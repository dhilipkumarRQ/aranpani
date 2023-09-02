import express,{RequestHandler} from 'express'
import prisma from '../utils/prisma_init'
import createHttpError from 'http-errors'
import {DEFAULT_PASSWORD} from '../config'
import { generateHashPass } from '../utils/password_verify'


const addGroupMember:RequestHandler = async(req,res,next) => {
    try{
        const {name, phone_number} = req.body
        const donor = await prisma.donorGroup.create({data:{name:name,phone_number:phone_number,donor_id:Number(req.user_id)}})
        res.json({donor})
    }catch(error){
        next(error)
    }
}
const getGroupMember:RequestHandler = async(req,res,next) => {
    try {
        const {id} = req.params
        const donorGroup = await prisma.donor.findUnique({
                where:{id:Number(id)},
                select:{donor_groups:true}
            })
        res.json(donorGroup)
    } catch (error) {
        next(error)
    }
}
const getParticularGroupMember:RequestHandler = async(req,res,next) => {
    try {
        const {id} = req.params
        const donorGroup = await prisma.donorGroup.findUnique({
                where:{id:Number(id)},
            })
        res.json(donorGroup)
    } catch (error) {
        next(error)
    } 
}
const editParticularGroupMember:RequestHandler = async(req,res,next) => {
    try {
        const {id} = req.params
        const donorGroup = await prisma.donorGroup.update({
                where:{id:Number(id)},
                data: {...req.body}
            })
        res.json(donorGroup)
    } catch (error) {
        next(error)
    } 
}

const verifyGroupMember:RequestHandler = async (req,res,next) => {
    try {
        const {id} =  req.params
        const  {otp} = req.body
        const groupMember = await prisma.donorGroup.findUnique({where:{id:Number(id)}})
        if(groupMember) {
            if(otp == groupMember.otp) {
                await prisma.donorGroup.update({where:{id:Number(id)},data:{is_verified:true}})
                res.send({"message":"otp verified successfully"})
            }else{
                next(createHttpError(422, 'otp verification failed'))
            }
        }else{
            res.send({"message": "group account is not present"})
        }
    } catch (error) {
        next(error)
    }
}
const deleteParticlarGroupMember:RequestHandler = async(req,res,next) => {
    try {
        const {id} =  req.params
        await prisma.donorGroup.update({where:{id:Number(id)}, data:{deleted_at:new Date()}})
        res.send({"message":"group member deleted successfully"})
    } catch (error) {
        next(error)
    }
}
const promoteToDonor:RequestHandler = async(req,res,next) => {
    try {
        const {id} = req.params
        var donor = await prisma.donor.findUnique({where: {phone_number: req.body.phone_number}})
        if(donor) {
            next(createHttpError.Conflict('phone number already linked to other account'))
        }
        donor = await prisma.donor.findUnique({where: {email:req.body.email}})
        if(donor) {
            next(createHttpError.Conflict('email already linked to other account'))
        }
        req.body.password = DEFAULT_PASSWORD
        const hash = await generateHashPass(req)
        donor  = await prisma.donor.create({data:{...req.body,password:hash}})
        res.json(donor)
    } catch (error) {
        next(error)
    }
}
const promoteToHead:RequestHandler = async(req,res,next) => {
    try {
        const {id} = req.params
        const groupMember = await prisma.donorGroup.findUnique({
            where:{id:Number(id)},
            select:{
                name: true,
                phone_number: true,
                donor: {
                    select: {
                        name: true,
                        phone_number: true
                    }
                }
            }
        })
        const new_donor_name = groupMember?.name || ''
        const new_donor_phone = groupMember?.phone_number
        const new_grp_member_name = groupMember?.donor.name
        const new_grp_member_phone = groupMember?.donor.phone_number

        const updated = await prisma.donorGroup.update({
            where:{id:Number(id)},
            data:{
                name: new_grp_member_name||'',
                phone_number: new_grp_member_phone,
                donor: {
                    update: {
                        name: new_donor_name,
                        phone_number: new_donor_phone,
                        is_otp_verified:false
                    }
                }
            }
        })
        res.send(updated)

    } catch (error) {
        next(error)
    }
}


export default {addGroupMember, getGroupMember,getParticularGroupMember,editParticularGroupMember,deleteParticlarGroupMember,promoteToDonor,promoteToHead, verifyGroupMember}















