const express = require('express')
const router = express.Router();
const {createQuery,deleteQuery,getQueries,voteQuery,updateQuery} = require('../controllers/queries')
const protectRoute= require('../utils/protectRoute')
router.post('/:id',protectRoute,createQuery)
router.get('/:id',getQueries)
router.delete('/:id/:id',protectRoute,deleteQuery)
router.put('/:id/:id',protectRoute,voteQuery)
//router.put('/:id/:id',protectRoute,updateQuery)
module.exports = router;