import { userService } from './user.service'
import { logger } from '../../services/logger.service'
import { Request, Response } from 'express'
import { User } from '../../models/user.model';
const nodemailer = require('nodemailer');


async function getUser(req: Request, res: Response) {
    try {
        const user = await userService.getById(req.params.userId)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

async function updateUser(req: Request, res: Response) {
    try {
        const user = req.body
        const updatedUser = await userService.update(user)
        res.send(updatedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

async function sendVerificationCode(req:Request, res:Response) {
    const { username } = req.body
    const code = Math.floor(100000 + Math.random() * 900000)
    //Traer el usuario por el username y actualizar el codigo de verificacion
    const users: User[] = await userService.getByUsername(username) as User[]
    if(users.length <= 0) {
        res.status(500).send({ err: 'Failed to send verification code, No user found' })
    }
    const user = users[0]
    user.verificationCode = code
    const email = user.email
    await userService.update(user)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "oscarricardo.sipo@gmail.com",
            pass: "hvti kxvl miwl flpf"
        }
    });
    const mailOptions = {
        from: "oscarricardo.sipo@gmail.com",
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is: ${code}`
    };
    transporter.sendMail(mailOptions, function(error: any, info: any){
        if (error) {
            console.log(error);
            res.status(500).send({ err: 'Failed to send verification code' })
        } else {
            console.log('Email sent: ' + info.response);
            res.send({ code: code })
        }
    });
  }

  //Verify user code
    async function verifyUser(req: Request, res: Response) {
        const { code, user } = req.body
        const verificationCode = code.verificationCode as number
        const users: User[] = await userService.getByUsername(user.username) as User[]
        if(users.length <= 0) {
            res.status(500).send({ err: 'Failed to verify user, No user found' })
        }
        const vUser = users[0]
        if (vUser.verificationCode == verificationCode) {
            // vUser.verified = true
            // await userService.update(user) // Comentado para que siempre que se ingrese se tenga que hacer una verificacion, como el 2FA
            res.send(true)
        } else {
            res.send(false)
        }
    }

    //Check if user is verified
    async function userVerificated(req: Request, res: Response) {
        const user = req.body as User;
        res.send(user.verified);
    }

export const userController = {
    getUser,
    updateUser,
    sendVerificationCode,
    verifyUser,
    userVerificated
}