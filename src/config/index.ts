export const OTP = 1111
export const SECRET_KEY = 'jwt_aranpani secret'
export enum Roles {ADMIN='admin',SUPER_ADMIN='super_admin',DONOR='donor',AREA_REP='area_rep'}
export const ADMIN = 'admin'
export const SUPER_ADMIN = 'super_admin'
export const DONOR = 'donor'
export const AREA_REP = 'area_rep'
export const DEFAULT_PASSWORD = 'pass1234'
export const MAX_REGISTER_NUMBER = 10000000

export const PROJECT_STATUS = {
    PROPOSED : 'proposed',
    PLANNED :  'planned',
    ACTIVE : 'active',
    COMPLETED : 'completed',
    SCRAPPED : 'scrapped'
}
export const PROJECT_STATUS_ORDER = [PROJECT_STATUS.PROPOSED, PROJECT_STATUS.PLANNED, PROJECT_STATUS.ACTIVE, PROJECT_STATUS.COMPLETED]
