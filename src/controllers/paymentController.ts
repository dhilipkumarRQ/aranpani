import express,{RequestHandler} from 'express'
import { STRIPE_SECRET_KEY,MY_DOMAIN,SECRET_KEY ,PAYMENT_MODE, STRIPE_WEBHOOK_SECRET} from '../config';
const stripe = require('stripe')(STRIPE_SECRET_KEY);
import paymentUtils from "../utils/payments/paymentUtils";
import prisma from '../utils/prisma_init';
import jwt,{JwtPayload} from "jsonwebtoken";
import {IJwtInterface} from '../utils/jwt_token'
import createHttpError from 'http-errors';
import crypto from 'crypto'


interface IJwtPaymentInterface extends IJwtInterface {
    user_id: number
    role: string
    payment_type: string
    payment_id: number

}


const getPaymentMode:RequestHandler = async(req,res,next) => {
    try {
        res.send("to be implemented")
    } catch (error) {
        next(error)
    }
}
const getAllPayment:RequestHandler = async(req,res,next) => {
    
}
const getSinglePayment:RequestHandler = async(req,res,next) => {}
interface Donor {
    name: string
    phone_number: string
    payment_amount: number
}

const getPaymentLink:RequestHandler = async(req,res,next) => {
    try { 
        const listOfDonor: Donor[] = await paymentUtils.getListOfDonor(req.user_id)
        const payment = await prisma.payment.findFirst({
                where:{donor_id:Number(req.user_id)},
                orderBy:{created_at:'desc'}})
        if(payment){
            const PAYLOAD = {
                payment_type: 'stripe',
                payment_id: payment?.id,
                user_id: req.user_id,
                role: req.role
            }
            const paymentToken =  jwt.sign(PAYLOAD, SECRET_KEY, {expiresIn: '1 days',});
            const session  = await stripe.checkout.sessions.create({
                mode: 'payment',
                line_items: listOfDonor.map((donor:Donor) => {
                    return {
                                price_data: {
                                    currency: "inr",
                                    product_data: {name: donor.name,},
                                    unit_amount: donor.payment_amount
                                },
                                quantity: 1
                           }
                }),
                success_url: `${MY_DOMAIN}?token=${paymentToken}&checkout-session-id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${MY_DOMAIN}/cancel.html`,
                metadata: { userId : req.user_id, role: 'donor'},
            })
            res.json({ url: session.url })
        }else{
            next(createHttpError(404, 'payment entry not found'))
        }
        
    } catch (error) {
        next(error)
    }
}

const verifyPaymentAndUpdateStatus:RequestHandler = async(req,res,next) => {
    try {
        const token = req.query['token']
        const decoded:IJwtPaymentInterface = jwt.verify(String(token), SECRET_KEY) as IJwtPaymentInterface;
        const session:any = req.query['checkout-session-id']
        const payment = await prisma.payment.update({
            where:{id:Number(decoded.payment_id)},
            data:{
                payment_session_id: session,
                payment_mode: PAYMENT_MODE.STRIPE as any
            }
        })
        res.json(payment)
    } catch (error) {
        next(error)
    }
}


function verifyWebhookSignature(payload:any, signatureHeader:any) {
    const signature = signatureHeader.split('t=')[1]; // Extract the timestamped signature
    const timestamp = signatureHeader.split(',')[0]; // Extract the timestamp
    const timestampBuffer = Buffer.from(timestamp, 'utf-8');
    const payloadBuffer = Buffer.from(payload, 'utf-8');
    const secretBuffer = Buffer.from(String(STRIPE_WEBHOOK_SECRET), 'utf-8');
  
    // Concatenate the timestamp and payload
    const concatenatedBuffer = Buffer.concat([timestampBuffer, payloadBuffer]);
  
    // Compute the expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secretBuffer)
      .update(concatenatedBuffer)
      .digest('hex');
  
    return expectedSignature === signature;
}

const webhookHandler:RequestHandler = async (req, res, next) => {
    
    // const sig = req.headers['stripe-signature'];
    const event = req.body;
    // console.log(event)
    // res.send("asdfsadfsdfsdfsd")
    try {
        // const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
        switch (event.type) {
            case 'checkout.session.completed':
                const chekoutCompleted = event.data.object;
                console.log('success....')
                console.log(`event type ${event.type}`);
                break;
            case 'checkout.session.expired':
                const chekoutExpired = event.data.object;
                console.log('expired....')
                console.log(`event type ${event.type}`);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.json({"message": "webhook recieved!"});
    } catch (error: any) {
        console.log(error.message)
        next(error)
    }
}

export default {getPaymentMode, getAllPayment, getSinglePayment, getPaymentLink,verifyPaymentAndUpdateStatus, webhookHandler}