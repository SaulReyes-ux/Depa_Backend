import { Socket, Server } from "socket.io"
import { Server as HttpServer } from "http" 
import { Order } from "../models/order.model"
import { logger } from './logger.service'

interface CustomSocket extends Socket {
  userId?: string
  myTopic?: string
}

let gIo: Server<CustomSocket> | null = null

export function setupSocketAPI(http: HttpServer) {
      gIo = new Server(http, {
            cors: {
                  origin: "https://tu-depa-47047.web.app",
                  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                  preflightContinue: false,
                  optionsSuccessStatus: 204
            }
      })
      gIo.on('connection', (socket: CustomSocket) => {
            console.log(`New connected socket [id: ${socket.id}]`)
            socket.on('disconnect', () => {
                  console.log(`Socket disconnected [id: ${socket.id}]`)
            })
            socket.on('order-coming-event', (order: Order) => {
                  console.log(`New order invite from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`)
                  socket.to(order.host._id).emit('order-coming-emit', (order))
            })
            socket.on('order-update-event', (order: Order) => {
                  console.log(`New order status update from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`)
                  socket.to(order.buyer._id).emit('order-update-emit', (order))
            })
            socket.on('set-user-socket', (userId:string) => {
                  console.log(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
                  socket.join(userId)
                  socket.userId = userId
            })
            socket.on('unset-user-socket', () => {
                  console.log(`Removing socket.userId for socket [id: ${socket.id}]`)
                  if(socket.userId) {
                        socket.leave(socket.userId)
                        delete socket.userId
                  }
                 
            })
      })
}
