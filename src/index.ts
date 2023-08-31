import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
// import prisma from './helper_files/prisma_init';
import createHttpError from 'http-errors';
import routes from './routes/index'

dotenv.config()

const app: Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes)

app.use((req:Request, res:Response, next:NextFunction) => {
    next(createHttpError(404,'route does not exists'));
})

app.use((err:createHttpError.HttpError ,req:Request, res:Response, next:NextFunction) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
})

declare global {
    namespace Express {
      interface Request {
        user_id? : number
        role?: string
      }
    }
  }

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}...`)
})