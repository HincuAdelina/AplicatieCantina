const express = require('express')
var admin = require("firebase-admin");
const fs = require('fs')
const https = require('https')
const path = require('path')

// File URL
const url = `https://firebasestorage.googleapis.com/v0/b/cantina-a05ac.appspot.com/o/cantina-a05ac-firebase-adminsdk-xj98f-a053a2426f.json?alt=media&token=bc59eaa4-b40d-47b6-987c-371328dd1e53`

const app = express()

require('dotenv').config();

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.CLIENT_EMAIL,
    }),
});

app.post("/:topic/", express.text(), (req, res) => {
    var topic = req.params.topic
    var status = req.body
    if (topic == undefined || status == undefined) return res.end()

    const message = {
        data: {
            status
        },
        topic: topic
    };

    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
            res.end()
        })
        .catch((error) => {
            console.log('Error sending message:', error);
            res.end()
        });

})

app.listen(process.env.PORT || 3000)