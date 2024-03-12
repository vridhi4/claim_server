const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    Username: {
        type: String, 
        required: true
    },
    Password: {
        type: String, 
        required: false
    }


});

const Admin = mongoose.model('Admin', AdminSchema);



module.exports = Admin;

