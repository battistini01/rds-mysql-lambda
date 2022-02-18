# rds-mysql-lambda
AWS RDS integration with Lambda

A simple example to integrate a lambda with RDS using IAM role authentication

1. install dependencies: npm install
2. test: <em>npm run test</em>
3. create .zip archive including node_modules folder and index.js file
4. create your lambda assigning a custom defined role to permit it to connect to RDS - [see rds-db:connect action policy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.IAMPolicy.html)
5. upload lambda source from .zip archive
6. test your lambda and call it from your API Gateway
