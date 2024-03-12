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
 * ./api/customer/register:
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


//CUSTOMER CAN CLAIM A POLICY

router.post('/claim_policy/:policy_num', authenticate, async (req, res) => {
    try{
        const user_id  = req.user;

        const {policy_num } = req.params;

        const policy_id = await Policy.findOne({policyNumber: policy_num.toString()});
        if(!policy_id)
        {
            console.log("policy id not found");
        }

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
        const newClaim = new Claim({
            user_id,
            policy_id,
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



