'use strict';

const { promises: { readFile }} = require("fs");
const { get } = require('axios');

class Handler {
  constructor({ rekoSvc, translatorSvc }) {
    this.rekoSvc = rekoSvc;
    this.translatorSvc = translatorSvc;
  }

  async detectImageLabels(buffer) {
    const result = await this.rekoSvc.detectLabels({
      Image: {
        Bytes: buffer
      }
    }).promise()

    const workingItems = result.Labels.filter(({ Confidence }) => Confidence > 95)
    const names = workingItems
      .map(({ Name }) =>  Name)
      .join(";")

    return { names, workingItems };
  }

  async translateText(text) {
    const params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'pt',
      Text: text
    }

    const { TranslatedText } = await this.translatorSvc.translateText(params).promise()

    return TranslatedText.split(";");
  }

  formatTextResults(texts, workingItems) {
    const finalText = [];
    for(const indexText in texts) {
      const nameInPortuguese = texts[indexText];
      const confidence = workingItems[indexText].Confidence;

      finalText.push(
        `${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}`
      )
    }

    return finalText.join("\n");
  }

  async getImageBuffer(imageUrl) {
    const res = await get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(res.data, 'base64');
    return buffer;
  }

  async main(event) {
    try {
      const { imageUrl } = event.queryStringParameters

      // const imgBuffer = await readFile('./images/cat-with-glasses.jpg');
      const imgBuffer = await this.getImageBuffer(imageUrl);
      const { names, workingItems } = await this.detectImageLabels(imgBuffer);
      const texts = await this.translateText(names);

      const finalText = this.formatTextResults(texts, workingItems);

      return {
        statusCode: 200,
        body: `A imagem tem\n `.concat(finalText)
      }
    } catch (err) {
      console.log("Error:", err.stack)
      return {
        statusCode: 500,
        body: "Internal server error"
      }
    }
  }
}

const aws = require('aws-sdk');
const reko = new aws.Rekognition();
const translator = new aws.Translate();
const handler = new Handler({
  rekoSvc: reko,
  translatorSvc: translator
});

module.exports.main = handler.main.bind(handler);