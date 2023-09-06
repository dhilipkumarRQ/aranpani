import {RequestHandler, Request} from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import {s3Client} from '../utils/awsS3Init'
import {S3_BUCKET, AttachmentFrom, fileExtensions, imageExtensions} from '../config'
import prisma from '../utils/prisma_init'
import createHttpError from 'http-errors'





interface IMulterRequestFile {
    key: string
    path: string
    mimetype: string
    originalname: string
    size: number
    location: string
}
  
interface IImageUpload {
    file?: IMulterRequestFile
}

const uploadImage = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: String(S3_BUCKET),
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req:Request, file:any, cb:any) {
        const {id} = req.params
        const extension = file.originalname.split('.').pop();
        const image_id = Date.now()
        let filepath = `/project/${id}/photo/image-${image_id}.${extension}`
        cb(null, filepath)
      },
    }),
    limits: {
        fileSize: 1024 * 1024 * 2 // 2mb file size
    }
})

const  uploadImageToS3:RequestHandler =  async (req,res,next) => {
    try {
        const {id} = req.params
        const {attachment_from} = req.body
        const imagepath =  (req as IImageUpload).file?.key ?? ""
        if (Object.values(AttachmentFrom).indexOf(attachment_from) > -1) {
            const attachment  = await prisma.attachment.create({data:{attachment_type:'image', attachment_type_id: Number(id), attachment_path: imagepath}})
            if(attachment_from == AttachmentFrom.project) {
                await prisma.project.update({
                    where:{id:Number(id)},
                    data:{
                        attachments:{
                            connect:{id:attachment.id}
                        }
                    }
                })
            }else{
                await prisma.projectActivity.update({
                    where:{id:Number(id)},
                    data:{
                        attachments:{
                            connect:{id:attachment.id}
                        }
                    }
                })
            }
            res.json(attachment)
        }else{
            next(createHttpError(422, 'unable to process the request'))
        }
    } catch (error) {
        next(error)
    }
}
const getProjectImage:RequestHandler = async (req,res,next) => {
    try {
        const {id} = req.params
        const attachment = await prisma.project.findFirst({
            where:{id: Number(id)}, 
            select:{
                attachments: {
                    where: {
                       attachment_type: 'image'
                    }
                }
            }
        })
        res.json(attachment)
    } catch (error) {
        next(error)
    }
}
const getProjectAttachment:RequestHandler = async (req,res,next) => {
    try {
        const {id} = req.params
        const attachment = await prisma.project.findFirst({
            where:{id: Number(id)}, 
            select:{
                attachments: {
                    where: {
                       attachment_type: 'file'
                    }
                }
            }
        })
        res.json(attachment)
    } catch (error) {
        next(error)
    }
}
export default {uploadImageToS3, getProjectImage, uploadImage, getProjectAttachment}

