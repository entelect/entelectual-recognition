const express = require('express');
const router = express.Router();
const models = require("../database/models");

/**
* @swagger
* /v1/attendee/:
*   get:
*     tags:
*      - attendees
*     name: Attendee List
*     summary: Gets list of attendees by event
*     parameters:
 *       - name: eventId
 *         description: Event Id
 *         in: query
 *         required: true
 *         type: integer
*     produces:
*       - application/json
*     responses:
*       200:
*         description: List of attendees as a json object 
*/
router.get('/', async function (req, res, next) {
  try {
    const { eventId } = req.query;
    const attendees = await models.Attendee.findAll({
      where: { eventId: eventId }
    });
    return res.status(200).json({ attendees });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});


/**
* @swagger
* /v1/attendee/add:
*   post:
*     tags:
*      - attendees
*     name: Add
*     summary: Add attendee to event
*     consumes:
*       - application/json
*     parameters:
*       - name: body
*         in: body
*         schema:
*           type: object
*           properties:
*             username:
*               type: string
*             eventId:
*               type: integer
*         required:
*           - username
*           - eventId
*     produces:
*       - application/json
*     responses:
*       200:
*         description: List of attendees as a json object 
*/
router.post('/add', async function (req, res) {

  try {
    const { username, eventId } = req.body;
    const atendee = await models.Attendee.create({
      username: username,
      eventId: eventId,
    })
    return res.status(200).json({ atendee });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});



/**
* @swagger
* /v1/attendee/delete:
 *   post:
 *     tags:
 *       - attendees
 *     description: Deletes a single attendee
 *     produces:
 *       - application/json
*     parameters:
*       - name: body
*         in: body
*         schema:
*           type: object
*           properties:
*             username:
*               type: string
*             eventId:
*               type: integer
*         required:
*           - username
*           - eventId
 *     responses:
 *       200:
 *         description: Successfully deleted
*/
router.post('/delete', async function (req, res) {
  try {
    const { eventId, username } = req.body;
    const deleted = await models.Attendee.destroy({
      where: {
        eventId: eventId,
        username: username
      }
    });
    if (deleted) {
      return res.status(200).send("Attendee deleted");
    }
    throw new Error("Attendee not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});


module.exports = router;