const functions = require('firebase-functions');
const dialogflow = require('dialogflow');
const cors = require('cors')({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  return cors(request,response,() => {
    const projectId = 'jacky-bfdd4'; //https://dialogflow.com/docs/agents#settings
    const languageCode = 'en-US';
    let query = request.body.text;
    let sessionId = request.body.sessionid;

    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const req = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode,
        },
      },
    };
    // Send request and log result
    sessionClient
      .detectIntent(req)
      .then(responses => {
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.intent) {
          console.log(`  Intent: ${result.intent.displayName}`);
        } else {
          console.log(`  No intent matched.`);
        }
        return response.status(200).send(result);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
    // response.status(200).send({"se": 123});
  });
});
