import { stayService } from './stay.service'
import { logger } from '../../services/logger.service'
import { Request, Response } from 'express'
import { StayFilter } from '../../models/stay.model'

async function getStays(req: Request, res: Response) {
      try {
            const filterBy = req.query as StayFilter
            const index = req.query.page ? +req.query.page : 0
            const stays = await stayService.query(filterBy , index)
            res.json(stays)
      } catch (err) {
            // console.log('Failed to get stays', err)
            console.log(err)
            res.status(500).send({ err: 'Failed to get stays' })
      }
}

async function getStaysLength(req: Request, res: Response) {
      try {
            const filterBy = req.query as StayFilter
            logger.debug('Getting stays length')
            const stays = await stayService.staysLength(filterBy)
            res.json(stays)
      } catch (err) {
            console.log('Failed to get stays length', err)
            res.status(500).send({ err: 'Failed to get stays length' })
      }
}

async function getStayById(req: Request, res: Response) {
      try {
            const stayId = req.params.stayId
            const stay = await stayService.getById(stayId)
            res.json(stay)
      } catch (err) {
            console.log('Failed to get stay', err)
            res.status(500).send({ err: 'Failed to get stay' })
      }
}

async function addStay(req: Request, res: Response) {
      try {
            const stay = req.body

            const fullAddress = `${stay.loc.address}, ${stay.loc.city}, ${stay.loc.country}`
            const latLng = await stayService.getLatLng(fullAddress)
            //Coordenadas obtenidas de nominatim.openstreetmap.org
            stay.loc.lat = latLng.lat as number
            stay.loc.lan = latLng.lon as number
            const addedStay = await stayService.add(stay)
            res.json(addedStay)
      } catch (err) {
            console.log('Failed to add stay', err)
            res.status(500).send({ err: 'Failed to add stay' })
      }
}

async function updateStay(req: Request, res: Response) {
      try {
            const stay = req.body
            const updatedStay = await stayService.update(stay)
            res.json(updatedStay)
      } catch (err) {
            console.log('Failed to update stay', err)
            res.status(500).send({ err: 'Failed to update stay' })
      }
}



export const stayController = {
      getStays,
      getStaysLength,
      getStayById,
      addStay,
      updateStay,
}