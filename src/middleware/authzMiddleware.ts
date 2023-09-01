import {Response,Request,NextFunction}from 'express'
import { SECRET_KEY } from '../config';
import jwt from 'jsonwebtoken'
import { Roles } from '../config';
import createHttpError from 'http-errors';


export const isAdmin = (req:Request, res:Response, next:NextFunction) => {
    const token:any = req.headers['authorization']
    const decoded:any = jwt.verify(token, SECRET_KEY);
    if(decoded.role == Roles.ADMIN) {
        next()
    }else{
        next(createHttpError.Forbidden('access restricted'))
    }
}
export const isAreaRep = (req:Request, res:Response, next:NextFunction) => {
    const token:any = req.headers['authorization']
    const decoded:any = jwt.verify(token, SECRET_KEY);
    if(decoded.role == Roles.AREA_REP) {
        next()
    }else{
        next(createHttpError.Forbidden('access restricted'))
    }
}
export const isDonor = (req:Request, res:Response, next:NextFunction) => {
    const token:any = req.headers['authorization']
    const decoded:any = jwt.verify(token, SECRET_KEY);
    if(decoded.role == Roles.DONOR) {
        next()   
    }else{
        next(createHttpError.Forbidden('access restricted'))
    }
}
export const isSuperAdmin = (req:Request, res:Response, next:NextFunction) => {
    const token:any = req.headers['authorization']
    const decoded:any = jwt.verify(token, SECRET_KEY);
    if(decoded.role == Roles.SUPER_ADMIN) {
        next() 
    }else{
        next(createHttpError.Forbidden('access restricted'))
    }
}

export const isSuperAdminAndAdmin = (req:Request, res:Response, next:NextFunction) => {
    const token:any = req.headers['authorization']
    const decoded:any = jwt.verify(token, SECRET_KEY);
    if(decoded.role == Roles.SUPER_ADMIN || decoded.role == Roles.ADMIN) {
        next() 
    }else{
        next(createHttpError.Forbidden('access restricted'))
    }
}

export const isDonorAndAreaRep = (req:Request, res:Response, next:NextFunction) => {
    const token:any = req.headers['authorization']
    const decoded:any = jwt.verify(token, SECRET_KEY);
    if(decoded.role == Roles.DONOR || decoded.role == Roles.AREA_REP) {
        next() 
    }else{
        next(createHttpError.Forbidden('access restricted'))
    }
}