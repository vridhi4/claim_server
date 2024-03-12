const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const policyHolderSchema = new Schema({
    user_id : { type: mongoose.Schema.Types.ObjectId,   required: true   },

 policies: [{
    policy_id : {  type: mongoose.Schema.Types.ObjectId, required: true  },

    policyNumber : {type: String, required: true   },

    policyName: { type: String, required: true },

    premium: { type: String, required: true },

    sumAssured: { type: Number, required: true },

    startDate: { type: Date, required: true },

    endDate: { type: Date, required: true },

    
  }]
});

const PolicyHolder = mongoose.model('PolicyHolder', policyHolderSchema);
module.exports = PolicyHolder;