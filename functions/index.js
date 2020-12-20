const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rebook-3bf0f.firebaseio.com"
});

const express = require('express');
const cors = require('cors');
const app = express();
const db = admin.firestore();
app.use( cors({origin:true}));

//Routes 
app.get('/hello-world',(req,res)=>{
    return res.status(200).send('WORKING!');
})
//Create
app.post('/api/create',(req,res)=>{
    (async ()=>{
        try
        {
            await db.collection('products').doc()
            .create({
                name: req.body.name,
                description: req.body.description,
                price : req.body.price
            })

            return res.status(200).send();
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});
//Get all the products
app.get('/api/get',(req,res)=>{
    (async ()=>{
        try
        {
            let query = db.collection('products');
            let response = [];

            await query.get().then(querySnapshot =>{
                let docs = querySnapshot.docs;
                for(let doc of docs){
                    const selectedItem = {
                        id : doc.id,
                        name : doc.data().name,
                        description : doc.data().description,
                        price : doc.data().price
                    };
                    response.push(selectedItem);
                }
                return response;
            })
            return res.status(200).send(response);
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Get a product with specific id
app.get('/api/get/:id',(req,res)=>{
    (async ()=>{
        try
        {
            const document = db.collection('products').doc(req.params.id);
            let product = await document.get();
            let response = product.data();

            return res.status(200).send(response);
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});
//Update
app.put('/api/update/:id',(req,res)=>{
    (async ()=>{
        try
        {
            const document = db.collection('products').doc(req.params.id);
            
            await document.update({
                name : req.body.name,
                description : req.body.description,
                price : req.body.price 
            })

            return res.status(200).send(response);
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Delete
app.delete('/api/delete/:id',(req,res)=>{
    (async ()=>{
        try
        {
            const document = db.collection('products').doc(req.params.id);
            await document.delete();
            return res.status(200).send(response);
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

exports.app = functions.https.onRequest(app);