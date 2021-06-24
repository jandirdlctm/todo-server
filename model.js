const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://jandir_17:PtiOpPuiU8jdjXMs@cluster0.vqspd.mongodb.net/todoVille?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const todoSchema = mongoose.Schema({
    name: String,
    description: String,
    done: Boolean,
    deadline: Date,
    notes: [{body: String}]
})

const Todo = mongoose.model("Todo", todoSchema);

// let store = {};

module.exports = {
    Todo: Todo
}