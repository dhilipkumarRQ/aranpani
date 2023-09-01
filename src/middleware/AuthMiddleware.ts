import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import createHttpError from "http-errors";
import {IJwtInterface} from '../utils/jwt_token'

export default async (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers['authorization']
    if(token){
        try {
            const decoded:IJwtInterface = jwt.verify(token, SECRET_KEY) as IJwtInterface;
            req.user_id = decoded.user_id
            req.role = decoded.role
            next()
        } catch (error:any) {
            next(createHttpError(error.message))
        }
    }else{
        next(createHttpError.BadRequest('token missing'))
    }
}

