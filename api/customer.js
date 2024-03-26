const express = require('express');
const { models } = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/auth');



//mongodb models
const Customer = require('./../models/customer');
const Policy = require('./../models/policy');
const PolicyHolder = require('./../models/policyHolder');
const Claim = require('./../models/claims');


//swagger

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
 * /customer/register:
 *   post:
 *     summary: Register a new customer
 *     description: Creates a new customer account with the provided data.
 *     tags: [Customer Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       '201':
 *         description: A new customer account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       '400':
 *         description: Bad request, validation error, or customer already exists
 */

//swagger
/**
 * @swagger
 * /api/customer/register:
 *   post:
 *     summary: Register a new customer
 *     description: Creates a new customer account with the provided data.
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       '201':
 *         description: A new customer account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       '400':
 *         description: Bad request, validation error, or customer already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Indicates the status of the request (e.g., "Failed").
 *                 message:
 *                   type: string
 *                   description: A descriptive message explaining the error.
 */


//password handler

//swagger for login 
/**
 * @swagger
 * /customer/login:
 *   post:
 *     summary: "Login customer"
 *     description: "Authenticate customer and generate JWT token"
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "The email address of the customer."
 *               password:
 *                 type: string
 *                 description: "The password of the customer."
 *     responses:
 *       '200':
 *         description: "Successful login"
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
 *                   example: "Passowrd matched !!"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJwYXNzd29yZCI6ImxvY2FsaG9zdCIsImlhdCI6MTY0NjEyNzIwMCwiZXhwIjoxNjQ2MTI4ODAwfQ.OhJdKmYYC1GzDGfXdpfOoqO0T0A0m53lvCwEMfO5z"
 *       '400':
 *         description: "Invalid credentials"
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
 *       '401':
 *         description: "Invalid password"
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
 *                   example: "Invalid password"
*/

//swagger for login 

const bcrypt = require('bcrypt');


router.post('/test' , (req,res)=>{
    
    //a = req.body;
   //console.log(a);
   // res.send("hello post ")
    const body = req.body;
    //console.log(body);
    firstName = body.firstName;
   
    password = body.password;
    Customer.find({firstName}).then(data => {
        if(data){

            //console.log(data);
            console.log(data[1])
           
            //console.log(hashpass);
            res.json({
                status: "success"
            })
        }
    })

});



//CUSTOMER CAN BE REGISTERED
router.post('/register', (req,res) => {

    console.log("Register here")

    const body = req.body;
    console.log(body)
    firstName=body.firstName
    lastName=body.lastName
    password=body.password
    email=body.email
    gender=body.gender

    if (firstName == "" ||lastName == "" || password == "" || email == "" || gender == "")
    {
        res.json({
            status: "Failed",
            message: "Empty input field"
        });
    
    }
    else if(password.length < 8)
    {
        res.json({
            status:"Failed",
            message:"password too short"
        })

    }
    //checking if user already exists
    else{
        Customer.find({email}).then(result => {
            if(result.length){
                res.json({
                    status: "failed",
                    message: "user already exists"
                })
            }
            else
            {

                console.log("try thissss")
                //create a new user

                //password handling 
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword =>{

                    const newCustomer = new Customer({
                        firstName,
                        lastName,
                        password: hashedPassword,
                        email,
                        gender
                       
                    });

                    newCustomer.save().then(result =>{

                        res.json({
                            status: "success",
                            message: "sign up success",
                            data: result
                        })
                    }).catch(err =>{
                        res.json({
                            status: "failed",
                            message: "an error occured while saving a new user"
                        })

                    });

                }).catch(err =>{
                    res.json({
                        status: "failed",
                        message: "an error occured while hashing password"
                    })
                })

            }
        }).catch(err =>{
            console.log(err);
            res.json({
                status: "failed",
                message: "an error occured while checking for existing user"
            })
        })


    }


});

//CUSTOMER CAN LOGIN
router.post('/login', (req,res) => {

    console.log("login here")

    const body = req.body;
    console.log(body)
    
    password=body.password
    email=body.email

    if(email == "" || password == "")
    {
        res.json({
            status: "Failed",
            message: "empty credentials !!"
        })
    }
    else{
        Customer.find({email}).then(data => {
            if(data)
            {
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result) //password matches 
                    {
                        const payload = {id: data[0].id, password: data[0].password}; 
                        const token = jwt.sign(payload, 'secretisvridhi', { expiresIn: '1h' });
                        console.log(payload, token);
                        res.json({
                            status: "Success",
                            message: "Passowrd matched !!",
                            token: token
                        })
                    }
                    else{
                        console.log("password not matching")
                        res.json({
                            status: "Failed",
                            message: "Invalid password !!"
                        })
                    }

                }).catch(err =>{
                    res.json({
                        status: "Failed",
                        message: "error occured while comparing passwords!!"
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

//swagger for policies
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

// Policy Model


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
 * /customer/policies:
 *   get:
 *     summary: Get all policies
 *     description: Retrieve all policies from the database.
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
 *         description: An error occurred while fetching policies
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
 *                   example: "Internal server error"
 */


//CUSTOMER CAN VIEW MORE POLICIES(POLICIES NOT OWNED BY CUSTOMER)


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
//swagger for apply policy
/**
 * @swagger
 * /customer/applyPolicy:
 *   post:
 *     summary: Apply policy
 *     description: Apply a policy to a user account.
 *     tags: [Policy]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               policy_num:
 *                 type: string
 *                 description: The policy number to apply.
 *             required:
 *               - policy_num
 *     responses:
 *       '200':
 *         description: Policy applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Policy added successfully."
 *       '400':
 *         description: Policy already exists for the policyholder or invalid request
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
 *                   example: "Policy already exists for the policyholder."
 *       '404':
 *         description: Policy not found
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
 *                   example: "Policy not found."
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
 *                   example: "Internal Server Error."
 */


//swagger for apply policy 

//CUSTOMER CAN APPLY FOR A POLICY
router.post('/applyPolicy', authenticate, async (req, res) => {
    try {
        const user_id = req.user;
        const { policy_num } = req.body; // Changed to policyNumber
        const policyDetails = await Policy.findOne({ policyNumber: policy_num });
        
        if (!policyDetails) {
            return res.status(404).json({ success: false, message: 'Policy not found.' });
        }

        const currentDate = new Date();
        const endDate = new Date(currentDate);
        endDate.setFullYear(endDate.getFullYear() + 1);

        const newPolicy = {
            policy_id: policyDetails._id,
            policyNumber: policyDetails.policyNumber,
            policyName: policyDetails.policyName,
            premium: policyDetails.premium,
            sumAssured: policyDetails.sumAssured,
            startDate: currentDate,
            endDate: endDate,
        };

        let policyholder = await PolicyHolder.findOne({ user_id });

        if (!policyholder) {
            policyholder = new PolicyHolder({
                user_id,
                policies: [newPolicy]
            });

            await policyholder.save();
            return res.json({ success: true, message: 'Policy holder saved successfully' });
        } else {
            const policyExists = policyholder.policies.some(policy => policy.policyNumber === newPolicy.policyNumber);

            if (policyExists) {
                return res.status(400).json({ success: false, message: 'Policy already exists for the policyholder.' });
            } else {
                policyholder.policies.push(newPolicy);
                await policyholder.save();
                return res.json({ success: true, message: 'Policy added successfully.' });
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
});


//swagger for user policies

/**
 * @swagger
 * components:
 *   schemas:
 *     PolicyHolder:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           description: The ID of the user associated with the policy holder.
 *         policies:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               policy_id:
 *                 type: string
 *                 description: The ID of the policy.
 *               policyNumber:
 *                 type: string
 *                 description: The number of the policy.
 *               policyName:
 *                 type: string
 *                 description: The name of the policy.
 *               premium:
 *                 type: string
 *                 description: The premium of the policy.
 *               sumAssured:
 *                 type: number
 *                 description: The sum assured of the policy.
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the policy.
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the policy.
 */

/**
 * @swagger
 * /customer/user_policies:
 *   get:
 *     summary: Get user policies
 *     description: Retrieve policies associated with the authenticated user.
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 policies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PolicyHolder'
 *       '404':
 *         description: Policyholder not found
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
 *                   example: "Policyholder not found."
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
 *                   example: "Internal Server Error."
 */


//CUSTOMER CAN VIEW HIS POLICIES(OWNED BY CUSTOMER)

router.get('/user_policies',authenticate,  async (req, res) => {
    try {
        // Extract user_id from the request parameters
        const user_id  = req.user;
        console.log({user_id})
    
        // Find the policyholder by user_id
        const policyholder = await PolicyHolder.findOne({user_id});
        if (!policyholder) {
            return res.status(404).json({ success: false, message: 'Policyholder not found.' });
        }
        // Extract policies array from the policyholder document
        const policies = policyholder.policies;
        
        res.status(200).json({ success: true, policies });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
});



//swagger for claiming policy 

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
 * /customer/claim_policy/{policy_num}:
 *   post:
 *     summary: Claim policy
 *     description: Claim a policy by providing necessary information.
 *     tags: [Policy]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: policy_num
 *         required: true
 *         description: The number of the policy to claim.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               claim_amount:
 *                 type: number
 *                 description: The amount to claim.
 *               claim_reason:
 *                 type: string
 *                 description: The reason for the claim.
 *               Hospital_name:
 *                 type: string
 *                 description: The name of the hospital.
 *             required:
 *               - claim_amount
 *               - claim_reason
 *               - Hospital_name
 *     responses:
 *       '200':
 *         description: Policy claimed successfully
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
 *                   example: "Policy claimed successfully."
 *                 newClaim:
 *                   $ref: '#/components/schemas/Claim'
 *       '404':
 *         description: Policyholder or policy not found
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
 *                   example: "Policyholder not found."
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


//swagger for claiming policy 

//CUSTOMER CAN CLAIM A POLICY



router.post('/claim_policy/:policy_num', authenticate, async (req, res) => {
    try{
        const user_id  = req.user;

        const {policy_num } = req.params;
        // console.log(policy_num)
        const policy = await Policy.findOne({ policyNumber: policy_num.toString() });

        
        if (!policy) {
            // If policy is not found, return an error response
            return res.status(404).json({ error: 'Policy not found' });
        }
    
        
        
        

        // If policy is found, extract its ID
        const policy_id = policy._id;
        const sum = policy.sumAssured;

        console.log(policy_id);
        console.log(sum);


        const { claim_amount, claim_reason,Hospital_name } = req.body;

        const policyholder = await PolicyHolder.findOne({ user_id });
        if (!policyholder) {
            return res.status(404).json({ success: false, message: 'Policyholder not found.' });
        }
        console.log("userid",policyholder.user_id);
        console.log(policyholder.policies);
        
        const user = await Customer.findById(policyholder.user_id); // Await Customer.findById()
        console.log("username", user);
        const username = user.firstName;
        console.log("username", username);

        const claimedPolicy = policyholder.policies.find(policy => policy.policyNumber === policy_num);
      
        if (!claimedPolicy) {
            return res.status(404).json({ success: false, message: 'Policy not found.' });
        }

        if(claim_amount > claimedPolicy.sumAssured){
            return res.status(404).json({ success: false, message: 'Claim amount exceeded' });
        }
        const newClaim = new Claim({
            user_id,
            policy_id: policy_id,
            policy_num,
            user_name: username,
            claim_amount,
            claim_reason,
            Hospital_name, 
            Status: 'Pending'
        })
        await newClaim.save();
        return res.status(200).json({ status: "success", message: 'Policy claimed successfully.', newClaim });

    }catch(err){

        console.error(err);
        return res.status(500).json({ status: "failed", message: 'Internal Server Error.' });

    }
})
  
//CUSTOMER CAN VIEW CLAIMS

//swagger for vieing claims 

/**
 * @swagger
 * /customer/claims:
 *   get:
 *     summary: Get user claims
 *     description: Retrieve claims associated with the authenticated user.
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
 *                   example: "Internal Server Error."
 */

//swagger for viewing claims 
router.get('/claims', authenticate, async (req, res) => {
    try {
        const user_id = req.user;
        const claims = await Claim.find({ user_id });
        
        
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





module.exports = router;



