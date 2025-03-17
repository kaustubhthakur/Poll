const express = require('express')
const router = express.Router();
const protectRoute = require('../utils/protectRoute')
const {createPoll,deletePoll,getPoll,getPolls} = require('../controllers/polls')
router.post('/',protectRoute,createPoll)
router.delete('/:id',protectRoute,deletePoll)
router.get('/:id',protectRoute,getPoll)
router.get('/',getPolls)
module.exports = router;