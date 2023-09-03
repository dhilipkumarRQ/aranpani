import  express,{RequestHandler} from 'express'
import prisma from '../utils/prisma_init'
import {MAX_REGISTER_NUMBER, PROJECT_STATUS, PROJECT_STATUS_ORDER} from '../config'
import createHttpError from 'http-errors'
import validators from '../validators'

const addProject:RequestHandler = async(req,res,next) => {
    try {
        const register_no = Math.floor(Math.random() * (MAX_REGISTER_NUMBER + 1))
        const project = await prisma.project.create({data:{...req.body, register_no:String(register_no)}})
        res.send(project)
    } catch (error) {
        next(error)
    }
}
const updateProject:RequestHandler = async(req,res,next) => {
    res.send("to be implemented...")
}
const getAllProject:RequestHandler = async(req,res,next) => {
    try {
        var {search, limit, offset, sort, order} = req.query
        const orderBy = {[String(sort)]: order?'asc':'desc'};
        const page = (Number(offset)/Number(limit))+1
        var project
        if(search) {
            search = String(search)
            project = await prisma.project.findMany({
                where:{
                    OR:[
                        { register_no: { contains: search}, },
                        { temple_name: { contains:  search} },
                        { location: { contains:  search} },
                        { id: { equals: isNaN(parseInt(search))?undefined:Number(search)}},
                    ]
                },
                orderBy,
                skip: offset?Number(offset):undefined,
                take: offset?Number(limit):undefined
            })
        }else{
            project = await prisma.project.findMany({
                orderBy,
                skip: offset?Number(offset):undefined,
                take: offset?Number(limit):undefined
            })
        }
        res.json({project, "page":page?page:1})
    } catch (error) {
        next(error)
    }
}
const getProject:RequestHandler = async(req,res,next) => {
    try{
        const {id}  = req.params
        const donor = await prisma.project.findUnique({where:{id:Number(id)}})
        res.json(donor)
    }catch(error){
        next(error)
    }
}
const changeProjectState:RequestHandler = async(req,res,next) => {
    try {
        const {id} = req.params
        const {status} = req.body
        if (Object.values(PROJECT_STATUS).includes(status) && await isValidStateChange(status, id)) {
            var project
            if(status == PROJECT_STATUS.PLANNED) {
                const {error} = validators.projectValidator.plannedState.validate(req.body)
                if(error) {
                    next(error)
                    return
                }
                const start_date = new Date(req.body.start_date)
                const end_date = new Date(req.body.end_date)
                if(start_date.getTime() < end_date.getTime()) {
                    project = await prisma.project.update({
                        where:{id:Number(id)},
                        data:{...req.body, 
                        start_date: start_date,
                        end_date: end_date,
                        status:status
                    }})
                    res.json(project)
                }else{
                    next(createHttpError(422, 'start date should be before end date'))
                }
            }
            project = await prisma.project.update({
                where:{id:Number(id)},
                data:{...req.body}
            })
            res.json(project)
        }else{
            next(createHttpError(422, 'cannot process the status'))
        }
    } catch (error) {
        next(error)
    }
}
const deleteProject:RequestHandler = async(req,res,next) => {
    try {
        const {id}  = req.params
        const project = await prisma.project.findUnique({where:{id:Number(id)}})
        if(project) {
            await prisma.project.update({where:{id:Number(id)}, data:{status: PROJECT_STATUS.SCRAPPED as any , deleted_at: new Date()}})
            res.send({"message":"project scrapped successfully"})
        } else{
            next(createHttpError(404, 'project does not exists'))
        }
    } catch (error) {
        next(error)
    }
}
const getAllSubscriber:RequestHandler = async(req,res,next) => {}


const isValidStateChange = async (nextstate:string,id:string):Promise<boolean> => {
    const project = await prisma.project.findUnique({where:{id:Number(id)},select: {status:true}})
    const currentstate = project?.status || ''
    if(PROJECT_STATUS_ORDER.indexOf(currentstate)+1 == PROJECT_STATUS_ORDER.indexOf(nextstate)) {
        return true
    }
    return false
}

const restoreProject:RequestHandler = async(req,res,next) => {
    try {
        const {id} = req.params
        const project = await prisma.project.findUnique({where: {id: Number(id)}})
        if(project) {
            if(project.status == PROJECT_STATUS.SCRAPPED) {
                await  prisma.project.update({
                    where: {id:Number(id)}, 
                    data: {status: PROJECT_STATUS.ACTIVE as any, deleted_at: null}
                })
                res.send({"message": "project restored successfully"})
            }else{
                next(createHttpError(422, 'project is already active'))
            }
        }else{
            next(createHttpError(404, 'project does not exists'))
        }
        
    } catch (error) {
        next(error)
    }
}

export default {addProject, updateProject, getAllProject, getProject, changeProjectState, deleteProject, getAllSubscriber,restoreProject}






