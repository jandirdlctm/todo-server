// import express so yuo can use it.
const express = require("express");
// Instantiate your app/server
const app = express();
// importing the model file
const model = require("./model");
// getting the Todo schema
const Todo = model.Todo;
// define a port
const port = process.env.PORT || 8080;
// allowing the server to accept json data.
app.use(express.json({}));

const propertyList = ["name", "description", "done", "deadline"];


// making a change

app.get("/todos", function(req, res){
    res.setHeader("Content-Type", "application/json");

    let findQuery = {};
    if (req.query.name != null && req.query.name != undefined){
        findQuery.name = req.query.name
    }
    // get all the ones that are done
    if (req.query.done != null && req.query.done != undefined){
        findQuery.done = req.query.done
    }

    Todo.find(findQuery, function(err, todos){
        if (err){
            res.status(500).json({message: "Unable to list todos", error: err});
            return;
        }
        else if(todos == null){
            res.status(404).json({

            })
        }
        res.status(200).json(todos);
    })
});

app.get("/todos/:id", function(req, res){
    res.setHeader("Content-Type", "application/json");
    Todo.findById(req.params.id, (err, todo)=>{
        if (err){
            res.status(500).send(
                JSON.stringify({
                    message: `Unable to find todo with id ${req.params.id}`,
                    error: err,
                })
            )
            return;
        }
        else if(todo == null){
            res.sendStatus(404);
            return;
        }
        res.status(200).json(todo);
    })
})

app.post("/todos", function(req, res){
    res.setHeader("Content-Type", "application/json");

    if (req.body.name == null || req.body.name == undefined || req.body.description == null || req.body.description == undefined){
        res.status(500).json({
            message: "Unable to create todo, field not filled up"
        })
        return;
    }

    let newTodo = {
        name: req.body.name || "",
        description: req.body.description || "",
        done: req.body.done || false,
        deadline: req.body.deadline || new Date(),
        notes: req.body.notes
    };
    Todo.create(newTodo, (err, todo)=>{
        if (err){
            res.status(500).json({
                message: "Unable to create todo",
                error: err
            });
            return;
        }
        res.status(201).json(todo);
    })
    
});
app.post("/todos/:id/notes", function(req, res){
    var id = req.params.id
    Todo.findById(id, function(err, todo){
        if (err){
            res.status(500).json({
                message: "Todo does not exist",
                error: err
            })
            return;
        }
        else if (todo === null){
            res.status(404).json({
                message: `Todo with id: ${id} not found`,
                error: err
            });
        }
        else if (todo){
            todo.notes.push(req.body);
            todo.save().then(function(response){
                res.status(201).json(todo);
            })
            
        }
    })
})


app.delete("/todos/:id", function(req, res){
    Todo.findByIdAndDelete(req.params.id, function(err, todo){
        if (err){
            res.status(500).json({
                message: "Unbale to delete todo",
                error: err
            })
            return;
        }
        res.sendStatus(202);
    })
})

app.patch("/todos/:id", function(req, res){
    let updatingTodo ={}
    for (const property in propertyList){
        if (req.body[propertyList[property]] || req.body[propertyList[property]] === false){
            updatingTodo[propertyList[property]] = req.body[propertyList[property]];
        }
    }
    /*Apply to all other fields.

    Generally, I think it's ok to just use "if (!req.body.attribute){}" unless
    you're working with done, inwhich case you'd have to manually do it.*/
    // do the same for all the other fields

    Todo.updateOne({_id: req.params.id},{ $set: updatingTodo}, function(err, todoResponse){
        if (err){
            res.status(500).json({
                message: "Unable to patch todo",
                error: err
            })
            return;
        }
        else if (todoResponse === 0){
            res.status(404).send(
                JSON.stringify({
                    message: `Unable to find todo with id ${req.params.id}` 
                })
            )
            return;
        }
        res.send(200);
    })
})



app.put("/todos/:id", function(req, res){
    Todo.findOneAndUpdate({_id: req.params.id}, function(err, todoResponse){
        if (err){
            res.status(500).json({
                message: "Unable to update todo",
                error: err
            })
            return;
        }
        else if (todoResponse === 0){
            res.status(404).send(
                JSON.stringify({
                    message: `Unable to find todo with id ${req.params.id}` 
                })
            )
            return;
        }
        //Consider checking when todoResponse === 0
        res.send(200);
    })
});






// start the server
app.listen(port, function(){
    console.log(`app listening at http://localhost:${port}`);
})