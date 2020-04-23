//firebase functions
const functions = require('firebase-functions');
//cors
const cors = require('cors')({origin: true});
//admin
const admin = require('firebase-admin');
//express
const express = require('express');

//initialize firebase <<admin>>
//admin can basically access all firebase services
admin.initializeApp({credential: admin.credential.cert(require('./admin.json'))});

const app = express(); //to access express
const db = admin.firestore(); //simplify access to firestore (the database)



// //TODO: MAKE IT ALL ONE REQUEST - Will save money in the long one -- (one big request instead of multiple small ones)



// //Get names of songs within an alb
// /*
// {
//     "album": "albumName"
// }
// */
app.get('/albums',(req,res) => {
  cors(req,res,  () => {
    console.log(req.query.album);
    db.collection("qrVinyls").doc(req.query.album)
    .get()
    .then((doc) => {
        let data = doc.data();
        let songs = data.songs;
        return res.status(200).json({songs: songs});
    })
    .catch((error) => {
        console.log(error);
        return res.json(error);
    });
  });
});



// //get downlaod url of a song

// /*
// {
//     "song": "songName"
// }
// */
app.get('/songs',(req,res) => {
    const myFile = admin.storage().bucket("gs://virtual-vinyls.appspot.com").file(req.body.song);
    myFile.getSignedUrl({action: 'read', expires: '1,1,2040'}).then(urls => {
        const signedUrl = urls[0];
        console.log(urls[0]);
        return res.json(signedUrl);
    });
});




// app.get('/albumsTest', (req,res) => {
 
// cors(req,res, () => {

//   db.collection("qrVinyls").doc("123456").get().then((doc) => {
//     let data = doc.data;
//     console.log(data.test)
//     return res.status(201).json({ test: data.test });
//   }).catch((error) => {
//     return res.status(404).json({ error: error});
//   })
// });
// });


exports.api = functions.https.onRequest(app);

