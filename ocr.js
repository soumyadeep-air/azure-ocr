/*
  This code sample shows Prebuilt Read operations with the Azure Form Recognizer client library. 

  To learn more, please visit the documentation - Quickstart: Form Recognizer Javascript client library SDKs
  https://learn.microsoft.com/azure/applied-ai-services/form-recognizer/quickstarts/get-started-v3-sdk-rest-api?view=doc-intel-3.1.0&pivots=programming-language-javascript
*/

const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
require("dotenv").config();

function* getTextOfSpans(content, spans) {
  for (const span of spans) {
    yield content.slice(span.offset, span.offset + span.length);
  }
}

/*
  Remember to remove the key from your code when you're done, and never post it publicly. For production, use
  secure methods to store and access your credentials. For more information, see 
  https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-security?tabs=command-line%2Ccsharp#environment-variables-and-application-configuration
*/
const endpoint = process.env.ENDPOINT;
const key = process.env.KEY;

// sample document
// const formUrl =
//   "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png";

// const formUrl =
//   "https://aispfiles.blob.core.windows.net/uploads/IMG_20240128_194405_699.jpg";

async function extract({
  formUrl = `https://aispfiles.blob.core.windows.net/test-ocr/IMG_20240128_194405_699.jpg`,
}) {
  // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(key)
  );
  //   const poller = await client.beginAnalyzeDocument("prebuilt-read", formUrl);
  const poller = await client.beginAnalyzeDocument(process.env.MODEL, formUrl);

  const { documents: [result] } = await poller.pollUntilDone();

  return result
  // return { content, pages, languages, styles, keyValuePairs };
}

// main().catch((error) => {
//   console.error("An error occurred:", error);
//   process.exit(1);
// });

module.exports = extract;
