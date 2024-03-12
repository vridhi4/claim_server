const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const claimsSchema = new Schema({
   
    claim_id: {type: mongoose.Schema.Types.ObjectId},
    policy_num: {type: String },
    user_id:{type: mongoose.Schema.Types.ObjectId, required: true },
    user_name: {type: String, required: true},
    policy_id : { type: mongoose.Schema.Types.ObjectId, required: true  },
    claim_amount:{type: Number, required: true},
    claim_reason:{type: String },
    Hospital_name:{type: String},
    Status:{type:String}



});

const Claim = mongoose.model('ClaimSchema', claimsSchema);
module.exports = Claim;