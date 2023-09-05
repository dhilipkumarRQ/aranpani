import prisma from "../prisma_init"

const getListOfDonor:any = async (donor_id: Number) => {
    const donor  = await prisma.donor.findUnique({
        where:{
            id: Number(donor_id),
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

    var donor_details:any = []
    const payment_amount =  Number(donor?.subscription_plan?.payment_amount) * 100
    donor_details.push({name:`${donor?.name} ${donor?.donor_groups.length?"(family head)":''}`, 
                        phone_number:donor?.phone_number,
                        payment_amount: payment_amount
                    })
    for(const member of donor?.donor_groups||[]) {
        donor_details.push({name: member.name, 
                            phone_number: member.phone_number,
                            payment_amount: payment_amount
                        })
    }
    return donor_details
}

export default {getListOfDonor}