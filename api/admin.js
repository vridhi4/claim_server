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


//swagger for admin schema 
/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         Username:
 *           type: string
 *           description: The username of the admin.
 *         Password:
 *           type: string
 *           description: The password of the admin.
 */

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register admin
 *     description: Register a new admin with username and password.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 description: The username of the admin.
 *               Password:
 *                 type: string
 *                 description: The password of the admin.
 *             required:
 *               - Username
 *               - Password
 *     responses:
 *       '200':
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "sign up success"
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       '400':
 *         description: Bad request or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "failed"
 *                 message:
 *                   type: string
 *                   example: "user already exists"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "failed"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error."
 */



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

//swagger for login 

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate an admin by username and password.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the admin.
 *               password:
 *                 type: string
 *                 description: The password of the admin.
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '200':
 *         description: Admin logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Password matched !!"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '400':
 *         description: Bad request or empty credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "empty credentials !!"
 *       '401':
 *         description: Unauthorized, invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials !!"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error."
 */


    


    



//ADMIN CAN LLOGIN
router.post('/login', (req,res) => {

    const body = req.body;
    console.log(body)

    const {password, username} = body;
    const Username = username;
    const Password = password


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




//swagger for listing customers

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the customer.
 *         lastName:
 *           type: string
 *           description: The last name of the customer.
 *         password:
 *           type: string
 *           description: The password of the customer.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the customer.
 *         gender:
 *           type: string
 *           description: The gender of the customer.
 */
/**
 * @swagger
 * /admin/list:
 *   get:
 *     summary: Get list of users
 *     description: Retrieve a list of all users.
 *     tags: [Customer]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "list of users"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching customers"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */


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


//swagger for viewing policies 

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *   schemas:
 *     Policy:
 *       type: object
 *       properties:
 *         policyName:
 *           type: string
 *           description: The name of the policy.
 *         policyNumber:
 *           type: string
 *           description: The number of the policy.
 *         premium:
 *           type: number
 *           description: The premium amount of the policy.
 *         sumAssured:
 *           type: number
 *           description: The sum assured amount of the policy.
 *         startDate:
 *           type: string
 *           format: date
 *           description: The start date of the policy.
 *         endDate:
 *           type: string
 *           format: date
 *           description: The end date of the policy.
 */


/**
 * @swagger
 * /admin/policies:
 *   get:
 *     summary: Get policies
 *     description: Retrieve a list of all policies.
 *     tags: [Policy]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "All policies are listed"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Policy'
 *       '404':
 *         description: No policies found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "No policies found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching policies"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */


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


//swagger for new policy 

/**
 * @swagger
 * /admin/create_policy:
 *   post:
 *     summary: Create a new policy
 *     description: Create a new policy with the provided details.
 *     tags: [Policy]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               policyName:
 *                 type: string
 *                 description: The name of the policy.
 *               policyNumber:
 *                 type: string
 *                 description: The unique number of the policy.
 *               premium:
 *                 type: number
 *                 description: The premium amount of the policy.
 *               sumAssured:
 *                 type: number
 *                 description: The sum assured amount of the policy.
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the policy.
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the policy.
 *     responses:
 *       '201':
 *         description: Policy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Policy created successfully"
 *                 policy:
 *                   $ref: '#/components/schemas/Policy'
 *       '400':
 *         description: Bad request, policy with the same policy number already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Policy with the same policy number already exists"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error occurred while creating policy"
 */


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



  //swagger for deleting a policy 


  /**
 * @swagger
 * /admin/delete_policy/{id}:
 *   delete:
 *     summary: Delete a policy
 *     description: Delete a policy by its ID.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the policy to delete.
 *     responses:
 *       '200':
 *         description: Policy deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Policy deleted successfully"
 *                 deletedPolicy:
 *                   $ref: '#/components/schemas/Policy'
 *       '404':
 *         description: Policy not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Policy not found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error occurred while deleting policy"
 */


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


  /**
 * @swagger
 * components:
 *   schemas:
 *     Claim:
 *       type: object
 *       properties:
 *         claim_id:
 *           type: string
 *           description: The ID of the claim.
 *         policy_num:
 *           type: string
 *           description: The policy number associated with the claim.
 *         user_id:
 *           type: string
 *           description: The ID of the user associated with the claim.
 *         user_name:
 *           type: string
 *           description: The name of the user associated with the claim.
 *         policy_id:
 *           type: string
 *           description: The ID of the policy associated with the claim.
 *         claim_amount:
 *           type: number
 *           description: The amount claimed.
 *         claim_reason:
 *           type: string
 *           description: The reason for the claim.
 *         Hospital_name:
 *           type: string
 *           description: The name of the hospital associated with the claim.
 *         Status:
 *           type: string
 *           description: The status of the claim.
 */

/**
 * @swagger
 * /admin/claims:
 *   get:
 *     summary: Get claims
 *     description: Retrieve a list of all claims.
 *     tags: [Claim]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 claims:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Claim'
 *       '404':
 *         description: Claims not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Claims not found."
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */

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



/**
 * @swagger
 * /admin/pending_claims:
 *   get:
 *     summary: Get pending claims
 *     description: Retrieve a list of all pending claims.
 *     tags: [Claim]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pending claims fetched successfully"
 *                 pendingClaims:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Claim'
 *       '404':
 *         description: No pending claims found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No pending claims found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error occurred while fetching pending claims"
 */



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


//swagger for approve claim 
/**
 * @swagger
 * /admin/approve_claim/{id}:
 *   put:
 *     summary: Approve a claim
 *     description: Update the status of a claim to 'Approved' by its ID.
 *     tags: [Claim]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the claim to approve.
 *     responses:
 *       '200':
 *         description: Claim status updated to approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Claim status updated to approved"
 *                 updatedClaim:
 *                   $ref: '#/components/schemas/Claim'
 *       '400':
 *         description: Invalid claim ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid claim ID"
 *       '404':
 *         description: Claim not found or Policy not found for the claim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Claim not found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error occurred while approving claim"
 */


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

//swagger for denying claim 

/**
 * @swagger
 * /admin/deny_claim/{id}:
 *   put:
 *     summary: Deny a claim
 *     description: Update the status of a claim to 'Rejected' by its ID.
 *     tags: [Claim]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the claim to deny.
 *     responses:
 *       '200':
 *         description: Claim status updated to Rejected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Claim status updated to Rejected"
 *                 updatedClaim:
 *                   $ref: '#/components/schemas/Claim'
 *       '400':
 *         description: Invalid claim ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid claim ID"
 *       '404':
 *         description: Claim not found or Policy not found for the claim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Claim not found"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error occurred while Rejecting claim"
 */

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

