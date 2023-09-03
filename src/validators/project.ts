import Joi from "joi";


const createProject = Joi.object().keys({
    temple_name: Joi.string().required(),
    temple_incharge_name: Joi.string().required(),
    contact : Joi.string().length(10).regex(/^\d+$/).required(),
    location: Joi.string().required()
})

const status = Joi.object().keys({
    status: Joi.string().required(),
    start_date: Joi.date(),
    end_date: Joi.date(),
    estimate_amount: Joi.number(),
    expensed_amount: Joi.number()
})

const plannedState = Joi.object().keys({
    status: Joi.string().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    estimate_amount: Joi.number().min(1).required(),
    expensed_amount: Joi.number().min(1).required()
})

export default {createProject, status, plannedState}