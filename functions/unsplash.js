// const Unsplash = require("unsplash-js");
// const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
// const unsplash = new Unsplash({ accessKey: UNSPLASH_ACCESS_KEY });

exports.handler = function(event, context, callback) {
  // your server-side functionality

  callback(null, {
    statusCode: 200,
    body: "Hello, World"
  });
};
