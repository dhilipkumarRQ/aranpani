
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { STRIPE_WEBHOOK_SECRET} from '../config';
import crypto from 'crypto'


export default () => {
    return async (req:Request, res:Response, next:NextFunction) => {
        try{
            const signatureHeader:any = req.headers['stripe-signature'];
            const signature = signatureHeader.split('t=')[1]; // Extract the timestamped signature
            const timestamp = signatureHeader.split(',')[0]; // Extract the timestamp
            const timestampBuffer = Buffer.from(timestamp, 'utf-8');
            const payloadBuffer = Buffer.from(JSON.stringify(req.body), 'utf-8');
            const secretBuffer = Buffer.from(String(STRIPE_WEBHOOK_SECRET), 'utf-8');
          
            // Concatenate the timestamp and payload
            const concatenatedBuffer = Buffer.concat([timestampBuffer, payloadBuffer]);
          
            // Compute the expected signature
            const expectedSignature = crypto
              .createHmac('sha256', secretBuffer)
              .update(concatenatedBuffer)
              .digest('hex');
          
            if(expectedSignature === signature) {
                next()
            }else{
                return next(createHttpError(422, 'stripe signature verification failed')) 
            }
            
        }catch(err:any){
            return next(err)
        }
    }
}