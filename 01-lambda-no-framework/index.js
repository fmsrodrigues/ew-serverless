async function handler(event, context) {
  console.log("Environment:", JSON.stringify(process.env, null, 2));
  console.log("Event:", JSON.stringify(event, null, 2));

  return {
    msg: "Hi there!"
  }
}

module.exports = { handler };