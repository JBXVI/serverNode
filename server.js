const express =require('express')
const app = express()
const server = require('http').createServer()
const io = require("socket.io")(server,{cors:{origin:"*"}})
const parser = require('body-parser')
const hostname = "0.0.0.0"
app.use(parser.json())


const connections = [];
io.on("connection",(socket)=>{
    console.log("connected....")
    socket.on("constr", (data)=>{

        //replace existing clients
        let connection = connections.find((x=>x.uniqID === JSON.parse(data).UnqID))
        if(connection!==undefined){
            console.log("FOUND DUPLICATE...SO REPLACING")
            let replacing_client_index = connections.indexOf(connection)
            connections.splice(replacing_client_index,1)
        }
        else if(connection === undefined ){
            console.log("ADDING NEW CONNECTION")
            console.log(JSON.parse(data))
            Object.assign(socket, {uniqID:JSON.parse(data).UnqID})
            connections.push(socket);
        }




    })




    socket.on("disconnect",(data)=>{
        console.log("disconnected "+socket.id);
        //removing disconnected client
        let disconnected_client = connections.find(x=>x.id===socket.id)
        if(connections.includes(disconnected_client)){
            let index_of_disconnected_client = connections.indexOf(disconnected_client)
            connections.splice(index_of_disconnected_client,1)
            console.log(connections.length)
        }
    })
})



app.post("/",(req,res)=>{
    let client = req.body.client;
    let  message  = req.body.message;
    connections[client].emit("message",message);
    connections[client].on("message",(data)=>{
       try{
           console.log(JSON.parse(data))
           res.send(data);
       }
       catch(e){
           console.log(data)

       }
    });

})
app.listen(80)
server.listen(5555,hostname,()=>console.log("started server on 4000"))
