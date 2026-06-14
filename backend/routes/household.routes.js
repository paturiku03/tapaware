const express = require('express');
const router = express.Router();
const householdController = require('../controllers/household.controller');

router.get('/', householdController.getAllHouseholds);
router.post('/', householdController.addHousehold);

module.exports = router;