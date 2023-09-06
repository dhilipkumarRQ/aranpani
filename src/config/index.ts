import dotenv from 'dotenv'
dotenv.config()

export const OTP = 1111
export const SECRET_KEY = 'jwt_aranpani secret'
export enum Roles {ADMIN='admin',SUPER_ADMIN='super_admin',DONOR='donor',AREA_REP='area_rep'}
export const ADMIN = 'admin'
export const SUPER_ADMIN = 'super_admin'
export const DONOR = 'donor'
export const AREA_REP = 'area_rep'
export const DEFAULT_PASSWORD = 'pass1234'
export const MAX_REGISTER_NUMBER = 10000000

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
export const S3_BUCKET = process.env.S3_BUCKET
export const S3_REGION = process.env.S3_REGION

export const PROJECT_STATUS = {
    PROPOSED : 'proposed',
    PLANNED :  'planned',
    ACTIVE : 'active',
    COMPLETED : 'completed',
    SCRAPPED : 'scrapped'
}
export const PROJECT_STATUS_ORDER = [PROJECT_STATUS.PROPOSED, PROJECT_STATUS.PLANNED, PROJECT_STATUS.ACTIVE, PROJECT_STATUS.COMPLETED]

export const PAYMENT_MODE =  {
    GPAY : 'gpay',
    PAYTM : 'paytm',
    PHONEPE : 'phonepe',
    AMAZON_PAY : 'amazonpay',
    OFFLINE : 'offline',
    STRIPE : 'stripe'
  }

export const AttachmentType  = {
  file : 'file',
  image: 'image'
}

export const AttachmentFrom  = {
  project : 'project',
  activity: 'activity'
}



export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
export const MY_DOMAIN = 'http://localhost:8000/payment'

export const fileExtensions = [".jpeg", ".jpg", ".png"];
export const imageExtensions = [".pdf", ".doc"];