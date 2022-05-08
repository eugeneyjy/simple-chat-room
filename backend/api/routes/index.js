const router = module.exports = require('express').Router();

router.use('/users', require('./users').router);
router.use('/conversations', require('./conversations').router);