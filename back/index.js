const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://developer:MeRn%262%4026@cluster0.yktye.mongodb.net/userDetail?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("connected to DB")
}).catch((err) => {
    console.log(err)
})

const server = express();

server.use(cors());
server.use(express.json())
server.use(express.urlencoded({extended:true}));

const credential = mongoose.model("credential", {}, "passkey");

server.get("/", (req, res) => {
    res.send("server running on the port 3000...");
});

server.post("/mail", (req, res) => {

    const msg = req.body.msg;
    const sub = req.body.sub;
    const mailList = req.body.emailList;

    credential.find().then((data) => {

        const transpoter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:data[0].toJSON().username,
                pass:data[0].toJSON().password
            }
        });
    
        new Promise(async function(resolve, reject){
            try{
                for(let i = 0; i < mailList.length; i++){
                    await transpoter.sendMail({
                        from:"pytechdeveloper@gmail.com",
                        to:mailList[i],
                        subject:sub,
                        text:msg
                    })
                }
                
                resolve("Successful")
            }
            catch(error){
                reject("Failed")
            }
        }).then(() => {
            res.send(true)
        }).catch(() => {
            res.send(false)
        });
    
    }).catch((err) => {
        console.log(err)
    });
 
})

server.listen(3000, () => {
    console.log("server started");
});
