1. Create secutiry policy file
2. Create aws secutiry role (IAM)
3. Run the following command
  ##### Bash:
  ```
  aws iam create-role \
    --role-name lambda-example \
    --assume-role-policy-document file://policies.json \
    | tee logs/role.log
  ```

  ##### PowerShell:
  ```
  aws iam create-role `
    --role-name lambda-example `
    --assume-role-policy-document file://policies.json `
    | tee-object logs/role.log
  ```

4. Create file with the content and zip it
  ##### Bash:
  ```
    zip -r function.zip index.js
  ```

  ##### PowerShell:
  ```
    Compress-Archive -Path index.js -DestinationPath function.zip
  ```

5. Create file with the content and zip it
6. Create lambda function
   1. your-role-arn can be found in `logs/role.log`
  ##### Bash:
  ```
  aws lambda create-function \
    --function-name hello-cli \
    --zip-file fileb://function.zip \
    --handler index.handler \
    --runtime nodejs18.x \
    --role <your-role-arn> \
    | tee logs/lambda-create.log
  ```

  ##### PowerShell:
  ```
  aws lambda create-function `
    --function-name hello-cli `
    --zip-file fileb://function.zip `
    --handler index.handler `
    --runtime nodejs18.x `
    --role <your-role-arn> `
    | tee-object logs/lambda-create.log
  ```

7. Invoke your lambda
   ##### Bash:
  ```
  aws lambda invoke \
    --function-name hello-cli \
    --log-type Tail \
    logs/lambda-exec.log
  ```

  ##### PowerShell:
  ```
  aws lambda invoke `
    --function-name hello-cli `
    --log-type Tail `
    logs/lambda-exec.log
  ```

8. Update your lambda
   1. You need to zip it first and then update your function
  ##### Bash:
  ```
  zip -r function.zip index.js

  aws lambda update-function-code \
    --zip-file fileb://function.zip \
    --function-name hello-cli \
    --publish \
    | tee logs/lambda-update.log
  ```

  ##### PowerShell:
  ```
  Compress-Archive -Path index.js -DestinationPath function.zip -update

  aws lambda update-function-code `
    --zip-file fileb://function.zip `
    --function-name hello-cli `
    --publish `
    | tee-object logs/lambda-update.log
  ```

9. Remove the resources created
   1.  Remove function
   2.  Remove role
  ```
  aws lambda delete-function --function-name hello-cli
  aws iam delete-role --role-name lambda-example
  ```