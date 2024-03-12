const express = require('express');
const { models } = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/auth');


//mongodb Customer model
const Customer = require('./../models/customer');
const Policy = require('./../models/policy');
const Claim = require('./../models/claims');
const Admin = require('./../models/admin');

//encrypting Password
const bcrypt = require('bcrypt')

// Register an admin
router.post('/register', (req, res) => {
    console.log("Register here");
    const body = req.body;
    console.log(body);
    Password = body.Password;
    Username = body.Username;

    if (Password == "" || Username == "") {
        res.json({
            status: "Failed",
            message: "Empty input field"
        });
    } else {
        Admin.find({ Username }).then(result => {
            if (result.length) {
                res.json({
                    status: "failed",
                    message: "user already exists"
                });
            } else {
                // Create a new admin
                // Password handling
                const saltRounds = 10;
                bcrypt.hash(Password, saltRounds).then(hashedPassword => {
                    const newAdmin = new Admin({
                        Password: hashedPassword,
                        Username
                    });
                    newAdmin.save().then(result => {
                        res.json({
                            status: "success",
                            message: "sign up success",
                            data: result
                        });
                    }).catch(err => {
                        res.json({
                            status: "failed",
                            message: "an error occurred while saving a new user"
                        });
                    });
                }).catch(err => {
                    res.json({
                        status: "failed",
                        message: "an error occurred while hashing Password"
                    });
                });
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "failed",
                message: "an error occurred while checking for existing admin"
            });
        });
    }
});


    

    


    



//ADMIN CAN LLOGIN
router.post('/login', (req,res) => {

    console.log("login here")

    const body = req.body;
    console.log(body)
    
    Password=body.Password
    Username=body.Username

    if(Username == "" || Password == "")
    {
        res.json({
            status: "Failed",
            message: "empty credentials !!"
        })
    }
    else{
        Admin.find({Username}).then(data => {
            console.log({data})
            
            if(data)
            {
               
                const hashedPassword = data[0].Password;
                bcrypt.compare(Password, hashedPassword).then(result => {
                    if(result) //Password matches 
                    {
                        const payload = {id: data[0].id, Password: data[0].Password}; 
                        const token = jwt.sign(payload, 'secretisvridhi', { expiresIn: '1h' });
                        console.log(payload, token);
                        res.json({
                            status: "Success",
                            message: "Passowrd matched !!",
                            token: token
                        })
                    }
                    else{
                        console.log("Password not matching")
                        res.json({
                            status: "Failed",
                            message: "Invalid Password !!"
                        })
                    }

                }).catch(err =>{
                    res.json({
                        status: "Failed",
                        message: "error occured while comparing Passwords!!"
                    })
                })
            }
            else{
                res.json({
                    status: "Failed",
                    message: "Invalid credentials !!"
                })

            }
        }).catch(err =>{
            res.json({
                status: "Failed",
                message: "error occured while finding for existing users!!"
            })
        })

    }


});

//ADMIN CAN LIST ALL CUSTOMERS
router.get('/list', authenticate, async(req,res) =>{

    try{

        const users = await Customer.find();
        res.json({
            status:"success",
            message:"list of users",
            data: users
        })
    } catch(err)
    {
        res.status(500).json({
            status: "error",
            message: "An error occurred while fetching customers",
            error: error.message
        });
    }
 
});

//ADMIN CAN VIEW ALL POLICIES 
router.get('/policies', authenticate, async (req, res) => {
    try {
        const policies = await Policy.find();
        if (policies.length === 0) {
            // If no policies are found, return a 404 status code
            return res.status(404).json({
                status: "error",
                message: "No policies found"
            });
        }
        res.json({
            status: "success",
            message: "All policies are listed",
            data: policies
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while fetching policies",
            error: error.message
        });
    }
});

//create a new policy 
router.post('/create_policy', async (req, res) => {
    try {
      const { policyName, policyNumber, premium, sumAssured, startDate, endDate } = req.body;

      const existingPolicy = await Policy.findOne({ policyNumber });

      if (existingPolicy) {
          return res.status(400).json({ error: 'Policy with the same policy number already exists' });
      }
  
      // Create a new policy instance
      const policy = new Policy({
        policyName,
        policyNumber,
        premium,
        sumAssured,
        startDate,
        endDate
      });
  
      // Save the policy instance to the database
      await policy.save();
  
      res.status(201).json({ message: 'Policy created successfully', policy });
    } catch (err) {
      console.error('Error occurred while creating policy:', err);
      res.status(500).json({ error: 'Error occurred while creating policy' });
    }
  });



  //DELETE A POLICY 
router.delete('/delete_policy/:id', async (req, res) => {
    try {
        console.log("this block")
      const policyId = req.params.id;
      // Find the policy by ID and delete it
      const deletedPolicy = await Policy.findByIdAndDelete(policyId);
  
      if (!deletedPolicy) {
        return res.status(404).json({ error: 'Policy not found' });
      }
  
      res.json({ message: 'Policy deleted successfully', deletedPolicy });
    } catch (err) {
      console.error('Error occurred while deleting policy:', err);
      res.status(500).json({ error: 'Error occurred while deleting policy' });
    }
  });


  // ADMIN CAN GET ALL CLAIMS 

  router.get('/claims', authenticate, async (req, res) => {
    try {
        
        const claims = await Claim.find({});
        if (!claims || claims.length === 0) {
            return res.status(404).json({ success: false, message: 'Claims not found.' });
        }
        
        console.log('Claims:', claims);
     
        return res.status(200).json({ success: true, claims });
    } catch (err) {
        console.error('Error fetching claims:', err);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});




  //GET ALL PENDING CLAIMS
  router.get('/pending_claims', async (req, res) => {
    try {
        // Find all claims with status = 'pending'
        console.log()
        const pendingClaims = await Claim.find({ Status: 'Pending' });
        console.log(pendingClaims);

        // Check if there are no pending claims
        if (pendingClaims.length === 0) {
            return res.status(404).json({ message: 'No pending claims found' });
        }

        res.status(200).json({ message: 'Pending claims fetched successfully', pendingClaims });
    } catch (err) {
        console.error('Error occurred while fetching pending claims:', err);
        res.status(500).json({ error: 'Error occurred while fetching pending claims' });
    }
});


  //APPROVE A CLAIM , CHANGE CLAIM STATUS - APPROVED

  router.put('/approve_claim/:id', async (req, res) => {
    try{
        const claimId = req.params.id;
        if (!claimId) {
            return res.status(400).json({ error: 'Invalid claim ID' });
        }
        console.log(claimId);
        // Find the claim by ID
        const claim = await Claim.findById(claimId);
        // Check if the claim exists
        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }
        // Fetch the associated policy to get the sumAssured
        const policy = await Policy.findById(claim.policy_id);
        if (!policy) {
            return res.status(404).json({ error: 'Policy not found for the claim' });
        }
            // Update status to 'approved'
            const updatedClaim = await Claim.findByIdAndUpdate(claimId, { Status: 'Approved' }, { new: true });
            return res.status(200).json({ message: 'Claim status updated to approved', updatedClaim });
    } catch (err) {
        console.error('Error occurred while approving claim:', err);
        res.status(500).json({ error: 'Error occurred while approving claim' });
    }
});


//REJECT A CLAIM

router.put('/deny_claim/:id', async (req, res) => {
    try{
        const claimId = req.params.id;
        if (!claimId) {
            return res.status(400).json({ error: 'Invalid claim ID' });
        }
        console.log(claimId);
        // Find the claim by ID
        const claim = await Claim.findById(claimId);
        // Check if the claim exists
        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }
        // Fetch the associated policy to get the sumAssured
        const policy = await Policy.findById(claim.policy_id);
        if (!policy) {
            return res.status(404).json({ error: 'Policy not found for the claim' });
        }
            // Update status to 'approved'
            const updatedClaim = await Claim.findByIdAndUpdate(claimId, { Status: 'Rejected' }, { new: true });
            return res.status(200).json({ message: 'Claim status updated to Rejected', updatedClaim });
    } catch (err) {
        console.error('Error occurred while Rejecting claim:', err);
        res.status(500).json({ error: 'Error occurred while approving claim' });
    }
});











module.exports = router;

