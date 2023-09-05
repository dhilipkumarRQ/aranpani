import prisma from "../../src/utils/prisma_init";


async function main() {
    await prisma.subscriptionPlan.deleteMany()
    await prisma.subscriptionPlan.create({
        data:{
            id:1,
            plan_name: "monthly plan",
            payment_cycle: 1,
            payment_amount: 100,
            is_active: true,
        }
    })
   
    await prisma.subscriptionPlan.create({
        data:{
            id:2,
            plan_name: "quarterly scheme",
            payment_cycle: 3,
            payment_amount: 300,
            is_active: true,
        }
    })
    await prisma.subscriptionPlan.create({
        data:{
            id:3,
            plan_name: "half yearly scheme",
            payment_cycle: 6,
            payment_amount: 600,
            is_active: true,
        }
    })
    await prisma.subscriptionPlan.create({
        data:{
            id:4,
            plan_name: "annual scheme",
            payment_cycle: 12,
            payment_amount: 1200,
            is_active: true,
        }
    })


    await prisma.paymentStatus.deleteMany()
    await prisma.paymentStatus.create({
        data:{
            id:1,
            status: "pending",
        }
    })
    await prisma.paymentStatus.create({
        data:{
            id:2,
            status: "paid",
        }
    })
    await prisma.paymentStatus.create({
        data:{
            id:3,
            status: "paid by rep",
        }
    })
    await prisma.paymentStatus.create({
        data:{
            id:4,
            status: "pending with rep",
        }
    })
    await prisma.paymentStatus.create({
        data:{
            id:5,
            status: "not paid",
        }
    })
}
main()