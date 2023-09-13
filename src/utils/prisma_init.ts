import { PrismaClient } from '@prisma/client'
import {DATABASE_URL,NODE_ENV} from '../config'

const prisma = new PrismaClient({
    errorFormat: 'pretty'
})

async function main() {
}

main()
    .then(async () => {
        console.log(`node environment..........${NODE_ENV}`)
        console.log(`postgres db connected........${DATABASE_URL}`)
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

export default prisma
