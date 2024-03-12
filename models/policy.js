const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const policySchema = new Schema({
    policyName: {
        type: String, 
        required: true
    },
    policyNumber: {
        type: String, 
        required: true
    },
    premium: {
        type: Number, 
        required: true
    },

    sumAssured: {
        type: Number, 
        required: true
    },

    startDate: {
        type: Date,
        
    },
    endDate: {
        type: Date,
       
    }
});

// Custom setter function to store only date part

const Policy = mongoose.model('Policy', policySchema);


module.exports = Policy;


// const newPolicy = new Policy({
//     policyName: "Health For Sureeee",
//     policyNumber: "P007",
//     premium: 3000,
//     sumAssured: 800000,
//     startDate: new Date("2024-01-01"),
//     endDate: new Date("2025-01-01")
// });

// // Save the new policy document to the database
// newPolicy.save()
//     .then(savedPolicy => {
//         console.log("Policy saved successfully:", savedPolicy);
//     })
//     .catch(error => {
//         console.error("Error saving policy:", error);
//     });


