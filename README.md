# Claims-Management-Backend
This is a backend for Claims Management System 
It involves below mentioned functionalities based on two types of users - Admin & Customer
Customer:-
1. Customer Registration 
2. Customer Login 
3. View all policies – The customer will be able to see all the policies that are available to apply. 
4. View policies owned by customer – The customer will be able to see the policies that he/she owns.
5. Apply Policy - It is a button that will add the policy.
6. Claim Policy - The customer would be able to claim a policy by providing details in a form.  
7. View Claims – The customer will be able to view all the claims that are applied their status like pending, approved or rejected. 
8. Logout - It's a button in the header.
   
Admin:- 
1. Admin Login 
2. List All Customers – Admin can view all the customers 
3. View All Policies – Admin can view all the policies  
4. View Claims - Admin will be able to view all the claims in the home page  
5. View Pending Claims – Admin would be able to view all pending views of all the customers. 
6. Approve a Claim and Reject a Claim – Claims can be either approved or rejected by the admin. 
7. Create a New Policy 
8. Delete a Policy 

Features
RESTful API endpoints for interacting with the application/database
Middleware for handling requests, authentication, and error handling
Integration with a database (e.g., MongoDB, PostgreSQL)
CORS configuration for handling cross-origin requests
Environment variables configuration for sensitive data
Technologies Used
Node.js: JavaScript runtime for building server-side applications
Express.js: Web application framework for Node.js
[Database]: MongoDB
[Authentication]: JWT
[Testing Framework]: Swagger, Postman

Installation
Clone the repository:
git clone https://github.com/vridhi4/claim-server.git

Install dependencies

cd claim-server
npm install

Start the server:
npm start
 

