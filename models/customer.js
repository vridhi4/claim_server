const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    firstName: {
        type: String, 
        required: true
    },
    lastName: {
        type: String, 
        required: false
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: false,
        unique: true
    },
    gender: {
        type: String, 
        required: false
    }

});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;