const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getAnswer(question) {
  return new Promise((success, error) => {
    rl.question(question, (answer) => {
      success(answer);
    }, () => {
      error();
    });
  });
}

let response;
const responseArray = [];
async function mainFunc(questions) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of questions) {
    response = await getAnswer(item);
    responseArray.push({ question: item, response });
  }
  rl.close();
  return responseArray;
}

exports.getAnswersFor = async function (questions) {
  const res = await mainFunc(questions);
  return res;
};
