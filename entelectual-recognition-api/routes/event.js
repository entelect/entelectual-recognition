var express = require('express');
var router = express.Router();
var models = require("../database/models");

/**
* @swagger
* /v1/event/:
*   get:
*     tags:
*      - events
*     name: Event List
*     summary: Gets list of events
*     produces:
*       - application/json
*     responses:
*       200:
*         description: List of events as a json object 
*/
router.get('/', async function(req, res, next) {
    try {
        const events = await models.Event.findAll();
        return res.status(200).json({ events });
      } catch (error) {
        return res.status(500).send(error.message);
      }
});

module.exports = router;