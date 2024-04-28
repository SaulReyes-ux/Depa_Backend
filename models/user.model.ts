import { Request } from "express"
import { ObjectId } from "mongodb"

export interface User {
    _id: ObjectId
    username: string
    fullname: string
    email: string
    password?: string
    imgUrl: string
    userMsg: number
    hostMsg: number
    verificationCode: number
    verified: boolean
}

export interface AuthRequest extends Request{
    loggedinUser?: {
        _id: string,
        fullname: string,
  }
}
