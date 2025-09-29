import { Router } from 'express'
import auth from './modules/auth'
import users from './modules/users'
import leads from './modules/leads'
import activities from './modules/activities'

export const router = Router()
router.use('/auth', auth)
router.use('/users', users)
router.use('/leads', leads)
router.use('/activities', activities)


