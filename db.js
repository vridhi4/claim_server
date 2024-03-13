const mongoose = require("mongoose");

require('./models/customer')
require('./models/policy')
require('./models/policyHolder')
require('./models/claims')
require('./models/admin')

//connection 

mongoose
.connect('mongodb://localhost:27017/database-2')
.then(() => console.log("MongoDB connected") )
.catch((err) => console.log("Mongo error", err));

