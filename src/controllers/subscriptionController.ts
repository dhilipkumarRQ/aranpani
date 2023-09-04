import express , {RequestHandler} from 'express'
import prisma from '../utils/prisma_init'



const subscribe:RequestHandler = async (req,res,next) => {
    try {
        const {project_id}  = req.params
        const project = await prisma.project.update({
            where: { id: Number(project_id) },
            data: {donors: {connect: {id: Number(req.user_id)}}}
        })
        res.send({"message": `you have subscribed the ${project.temple_name} temple`})
    } catch (error) {
        next(error)
    }
}

const unsubscribe:RequestHandler = async(req,res,next) => {
    try {
        const {project_id}  = req.params
        const project = await prisma.project.update({
            where: { id: Number(project_id) },
            data: {donors: {disconnect: {id: Number(req.user_id)}}}
        })
        res.send({"message": `you have un subscribed the ${project.temple_name} temple`})
    } catch (error) {
        next(error)
    }
}

export default {subscribe, unsubscribe}