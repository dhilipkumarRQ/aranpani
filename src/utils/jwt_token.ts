import jwt, { JwtPayload } from 'jsonwebtoken'
import { Roles } from '../config'
import { ADMIN,SUPER_ADMIN,DONOR,AREA_REP } from '../config'
import { SECRET_KEY } from "../config";


export interface IJwtInterface extends JwtPayload {
    user_id: number
    role: string
}


export const generateToken =  (userModel: any, userType:Roles) => {
    var role = null
    if(userType == Roles.ADMIN) {
        role = ADMIN
    }else if(userType == Roles.SUPER_ADMIN) {
        role = SUPER_ADMIN
    }else if(userType ==  Roles.DONOR) {
        role = DONOR
    }else {
        role = AREA_REP
    }
    const payload: IJwtInterface = {
        'user_id' : userModel.id,
        'role': role,
        'iat': Date.now()
    } 
    const token =  jwt.sign(payload, SECRET_KEY, {expiresIn: '1 days',});
    return token
} 

