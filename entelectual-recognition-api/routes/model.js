const express = require('express');
const path = require('path');
const { promises: { readFile, readdir, writeFile } } = require('fs');
const faceapi = require("face-api.js")
const fetch = require('node-fetch')
const sharp = require('sharp');
const canvas = require("canvas")
require('@tensorflow/tfjs-node');
const router = express.Router();

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch: fetch });

const facesFileName = 'faces.json'


/**
* @swagger
* /v1/model/train:
*   get:
*     tags:
*      - models
*     name: Train Face Model
*     summary: Trains face model
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Sucessfully trained the face model
*/
router.get('/train', function (req, res, next) {

  const modelsPath = path.join(__dirname, 'models');
  Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath),
    faceapi.nets.faceExpressionNet.loadFromDisk(modelsPath),
    faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
    faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath),
    faceapi.nets.tinyFaceDetector.loadFromDisk(modelsPath)
  ]).then(() => {
    return getUserLabels()
  })
    .then((userLabels) => {
      trainModel(userLabels);
    }).then(()=>{
      res.send("Ok");
    })
});

async function getUserLabels() {
  const labels = [];
  const directoryPath = path.join(__dirname, 'users');
  await readdir(directoryPath)
    .then(folders => {
      folders.forEach(function (folder) {
        labels.push(folder);
      })
    });

  return labels;
}

async function trainModel(userLabels) {
  const directoryPath = path.join(__dirname, 'users');
  const faces = [];

  for (let i in userLabels) {
    const userDirectoryPath = path.join(directoryPath, userLabels[i]);
    const photos = await readdir(userDirectoryPath)
    const descriptors = []
    for (let j in photos) {
      const photoPath = path.join(userDirectoryPath, photos[j]);

      const options = new faceapi.TinyFaceDetectorOptions({
        scoreThreshold: 0.5,
        inputSize: 320
      });

      const imgBuffer = await readFile(photoPath);
      const resizedImageBuffer = await sharp(imgBuffer).resize(320, 247).toBuffer();
      const img = await canvas.loadImage(resizedImageBuffer)

      const detections = await faceapi.detectSingleFace(img, options).withFaceLandmarks().withFaceDescriptor();
      if (detections) {
        descriptors.push({
          path: photoPath,
          descriptor: detections.descriptor
        });
      }
    }

    faces.push({
      user: userLabels[i],
      descriptors: descriptors
    });
  }

  let facesJson = JSON.stringify(faces);
  const filePath = path.join(__dirname, facesFileName);
  await writeFile(filePath, facesJson)
}



/**
* @swagger
* /v1/model/face:
*   get:
*     tags:
*      - models
*     name: Face Model
*     summary: Gets the trained face model
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Face model as a json object 
*/
router.get('/face', function (req, res, next) {
  res.header("Content-Type", "application/json")
  const facesFile = path.join(__dirname, facesFileName)
  delete require.cache[facesFile]
  const result = require(facesFile)
  res.send(result);
});

module.exports = router;
