1. Install serverless framework on your machine `npm i -g serverless`
2. Initialize the framework with `serverless` or `sls`
3. Deploy the barebones project to verify if it's properly installed `serverless deploy`
4. Invoke your function 
   1. on aws: `serverless invoke -f hello`
   2. on local: `serverless invoke local -f hello --l`
5. Configure serverless dashboard
6. Get your logs on watch with `serverless logs -f hello --tail`
7. To remove your app use `serverless remove`