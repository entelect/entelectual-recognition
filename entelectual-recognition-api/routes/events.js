var express = require('express');
var router = express.Router();

/**
* @swagger
* /v1/events/:
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
router.get('/', function(req, res, next) {
    res.send("Ok");
});

module.exports = router;