import prisma from "../utils/prisma_init";
import {PAYMENT_MODE} from '../config'


const getDonorDetails = async () => {
   const payment_details = []
   const donors  = await prisma.donor.findMany({
        where:{
            is_otp_verified:true
        },
        select:{
            id: true,
            name:true, 
            phone_number:true,
            subscription_plan: {
                select: {
                    plan_name: true,
                    payment_cycle:true,
                    payment_amount:true
                }
            }, 
            donor_groups:{
                where: {
                    deleted_at: {
                        equals: null
                    }
                },
                select:{
                    id:true,
                    name:true,
                    phone_number:true
                }
            }
        }
    })
    for(const donor of donors) {
       const numOfDonors = donor.donor_groups.length?donor.donor_groups.length+1:1
       var payment:any = {}
       payment.payment_status_id = Number(1)
       payment.amount =  numOfDonors * Number(donor.subscription_plan?.payment_amount)
       payment.donor_id = donor.id
       payment_details.push(payment)
    }
    await prisma.payment.createMany({data:[...payment_details]})
}

getDonorDetails()








