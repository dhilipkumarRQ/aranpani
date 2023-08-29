import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import prisma from './helper_files/prisma_init';

dotenv.config()


prisma

const app: Express = express()
const PORT = process.env.PORT;

app.get('/', (req : Request,res : Response) => {
    res.send('setup done')
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}...`)
})