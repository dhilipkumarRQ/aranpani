import Joi from "joi";
import createHttpError from "http-errors";
import validators from "../validators/index";
import { Request, Response, NextFunction } from "express";

export default (validator: any) => {
    return async (req:Request, res:Response, next:NextFunction) => {
        try{
            await validator.validateAsync(req.body)
            next()
        }catch(err:any){
            if(err.isJoi) 
                return next(createHttpError(422, {message: err.message}))
            return next(createHttpError(500))
        }
    }
}