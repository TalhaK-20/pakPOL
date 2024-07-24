const mongoose = require("mongoose")

const connectDatabase = () => {
    mongoose.connect("mongodb+srv://cooltalhak:zxd6@cluster0.wkvblft.mongodb.net/?retryWrites=true&w=majority").then(() => {
        console.log("Connected to MongoDB");
    }).catch((e) => {
        console.log("Oh No ERROR!");
        console.log(e);
    })
}

module.exports = connectDatabase;

