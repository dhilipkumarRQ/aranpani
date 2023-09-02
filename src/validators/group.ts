import Joi from "joi";


const addGroup = Joi.object().keys({
    name: Joi.string().required(),
    phone_number: Joi.string().length(10).required()
})

export default {addGroup}