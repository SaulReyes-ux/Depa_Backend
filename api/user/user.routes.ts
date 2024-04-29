import express from 'express'
import { userController } from './user.controller'
export const router = express.Router()

router.get('/:userId', userController.getUser)
router.put('/', userController.updateUser)
router.post('/send-verification-email', userController.sendVerificationCode)
router.post('/verify-user', userController.verifyUser)
router.post('/verificated', userController.userVerificated)