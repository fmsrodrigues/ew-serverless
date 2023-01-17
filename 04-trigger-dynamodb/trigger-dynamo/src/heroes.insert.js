const { randomUUID } = require('crypto');
const Joi = require("@hapi/joi");

const decoratorValidator = require("./util/decoratorValidator");
const globalEnum = require("./util/globalEnum");

class Handler {
  constructor({ dynamoDbSvc }) {
    this.dynamoDbSvc = dynamoDbSvc;
    this.dynamoDbTable = process.env.DYNAMODB_TABLE;
  }

  static validator() {
    return Joi.object({
      name: Joi.string().max(100).min(1).required(),
      power: Joi.string().max(100).min(2).required(),
    })
  }

  prepareData(data) {
    const params = {
      TableName: this.dynamoDbTable,
      Item: {
        ...data,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      }
    }

    return params;
  }

  async insertItem(params) {
    return this.dynamoDbSvc.put(params).promise();
  }

  handlerSuccess(data) {
    const response = {
      statusCode: 200,
      body: JSON.stringify(data)
    }
    return response;
  }

  handlerError(data) {{
    return {
      statusCode: data.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: "Couldn't insert item!!"
    }
  }}

  async main(event) {
    try {
      const data = event.body;
      const dbParams = this.prepareData(data);
      await this.insertItem(dbParams);

      return this.handlerSuccess(dbParams.Item);
    } catch (err) {
      console.log("Error: ", err.stack);
      return this.handlerError({ statusCode: 500 });
    }
  }
}

// Factory
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const handler = new Handler({
  dynamoDbSvc: dynamoDB,
});
module.exports = decoratorValidator(
  handler.main.bind(handler),
  Handler.validator(),
  globalEnum.ARG_TYPE.BODY
);