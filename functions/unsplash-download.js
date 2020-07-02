const fetch = require("node-fetch");
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
};

const JsonResult = json => ({
  statusCode: 200,
  headers: {
    ...headers,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(json)
});

exports.handler = async function(event, context) {
  const query = event && event.queryStringParameters;
  const imageId = query.imageId;

  if (!imageId) {
    return JsonResult("needs imageId");
  }

  try {
    await fetch(`https://api.unsplash.com/photos/${imageId}/download?client_id=${UNSPLASH_ACCESS_KEY}`);
    return JsonResult("success");
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: "Something went wrong"
    };
  }
};
