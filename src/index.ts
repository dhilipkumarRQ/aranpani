import express, { Express, NextFunction, Request, Response } from 'express';

const morgan = require('morgan');
import createHttpError from 'http-errors';
import routes from './routes/index'
import bodyParser from 'body-parser'
import {PORT} from './config'





const app: Express = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(
  bodyParser.json({
    verify: (req:Request, res:Response, buf) => {
      req.rawBody = buf;
    },
  })
);
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req,res) => {res.send({"message":"aranpani project working......."})})
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


var server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}...`)
})

export default server

declare global {
  namespace Express {
    interface Request {
      user_id? : number
      role?: string
      rawBody?: Buffer
    }
  }
}

