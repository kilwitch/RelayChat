
import type { Request, Response } from "express"
import prisma from "../config/db.config.js"
class ChatsController{
    static async index(req:Request, res:Response){
        try {
            const {groupId}= req.params
            const chats=await prisma.chats.findMany({
                where:{
                    group_id:groupId,
                },
                orderBy: {
                    created_at: "asc"
                }
            })

            return res.json({data:chats})

        } catch (error) {
            return res.status(500).json({message:"something went wrong .please try again!"})
        }
    }
}

export default ChatsController