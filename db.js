const mongoose = require("mongoose");

require('./models/customer')
require('./models/policy')
require('./models/policyHolder')
require('./models/claims')
require('./models/admin')

//connection 

mongoose
.connect('mongodb+srv://vridhikatariya32:vridhiClaimsDB@cluster0.2qxax4m.mongodb.net/database-2')
.then(() => console.log("MongoDB connected") )
.catch((err) => console.log("Mongo error", err));

