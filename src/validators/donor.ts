import Joi from "joi";

const updateProfile = Joi.object().keys({
    name: Joi.string().required(),
    email : Joi.string().email().required(),
    father_name : Joi.string().required(),
    country: Joi.string().required(),
    district: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.number().min(100000).max(999999).required(),
    address: Joi.string().required()
})


const updatePinCode = Joi.object().keys({
    pincode: Joi.number().min(100000).max(999999).required()
})

const updateLanguage = Joi.object().keys({
    language: Joi.string().required()
})

const createDonor  = Joi.object().keys({
    name: Joi.string().required(),
    phone_number: Joi.string().length(10).required(),
    email : Joi.string().email().required(),
    password: Joi.string().required(),
    father_name : Joi.string().required(),
    country: Joi.string().required(),
    district: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.number().min(100000).max(999999).required(),
    address: Joi.string().required(),
    area_rep_id: Joi.number().required(),
    subscription_plan_id: Joi.number().required(),
    is_active: Joi.boolean().required()
})

export default {updateProfile, updatePinCode, updateLanguage, createDonor}