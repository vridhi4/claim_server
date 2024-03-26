const mongoose = require("mongoose");
const Customer = require('./models/customer');
const Policy = require('./models/policy'); // Import Policy model
const Claim = require('./models/claims');

require('./models/customer');
require('./models/policyHolder');
require('./models/claims');
require('./models/admin');

// Connect to MongoDB
mongoose.connect('mongodb+srv://vridhikatariya32:vridhiClaimsDB@cluster0.2qxax4m.mongodb.net/database-2')
    .then(() => {
        console.log("MongoDB connected");

        // Create change streams for Customer and Policy models
        const customerChangeStream = Customer.watch();
        const policyChangeStream = Policy.watch();
        const claimChangeStream = Claim.watch();

        // Listen for change events on Customer model
        customerChangeStream.on('change', change => {
            console.log("Received change event for Customer:", change);
            // Process the change event here
        });

        // Listen for change events on Policy model
        policyChangeStream.on('change', change => {
            console.log("Received change event for Policy:", change);
            // Process the change event here
        });

        claimChangeStream.on('change', change => {
            console.log("Received change event for claim:", change);
            // Process the change event here
        });

       
    })
    .catch(err => console.log("Mongo error", err));
