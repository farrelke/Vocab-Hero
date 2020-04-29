const fetch = require("node-fetch");
global.fetch = fetch;
const Unsplash = require("unsplash-js").default;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const unsplash = new Unsplash({ accessKey: UNSPLASH_ACCESS_KEY });

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
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

  if (!query) {
    return JsonResult(["pathParameters is wrong name"]);
  }

  const keyword = query.keyword;
  const page = query.page || 1;
  const perPage = query.perPage || 10;
  const orientation = query.orientation || "landscape";

  if (!keyword) {
    return JsonResult([]);
  }

  try {
    return unsplash.search
      .photos(keyword, page, perPage, { orientation })
      .then(res => res.json())
      .then(JsonResult);
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: "Something went wrong"
    };
  }
};
