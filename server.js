const express = require("express");
// Instantiate your app/server
const app = express();

// const {store, Todo} = require("./model");
const model = require("./model");

const Todo = model.Todo;

const cors = require("cors");
// const { Model } = require("mongoose");
// define a port
const port = 8080;

app.use(express.urlencoded({extended : false}));
app.use(cors); 


app.get("/jandir", function(req, res){
    console.log("this got hit");
    
})











app.listen(port, function(){
    console.log(`app listening at http://localhost:${port}`);
})