const readline = require('readline');
const utility = require('./utility.cjs');

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getAnswer(question, mcq) {
  return new Promise((success, error) => {
    if (mcq) {
      rl.question('', (answer) => {
        success(answer);
      }, () => {
        error();
      });
    } else {
      rl.question(`${utility.colors.green}${question}${utility.colors.reset}`, (answer) => {
        success(answer);
      }, () => {
        error();
      });
    }
  });
}

let response;
const responseArray = [];
async function main(questions) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of questions) {
    if (Array.isArray(item)) {
      console.log(`${utility.colors.green}${item[0]}${utility.colors.reset}`);
      item[1].forEach((element, index) => {
        console.log(`${utility.colors.yellow}[${index + 1}] ${element}${utility.colors.reset}`);
      });
      do {
        // eslint-disable-next-line no-await-in-loop
        response = await getAnswer(item[0], true);
      // eslint-disable-next-line max-len
      } while (!utility.tryParseInt(response, false) || !utility.validChoiceRange(response, item[1].length));
      utility.clearLine(-(item[1].length + 2));
      responseArray.push({ question: item[0], response });
    } if (typeof (item) === 'string') {
      response = await getAnswer(item, false);
      utility.clearLine(-1);
      responseArray.push({ question: item, response });
    }
  }
  rl.close();
  return responseArray;
}

async function jsonQuestion(filename) {
  const questions = utility.decodeQuestions(filename);
  if (utility.jsonQuestionValidate(questions)) {
    const obj = JSON.parse(questions);
    // eslint-disable-next-line no-restricted-syntax
    for await (const item of obj) {
      if (item.type === 'one-choice-mcq') {
        let errorCounter = -1;
        console.log(`${utility.colors.green}${item.label}${utility.colors.reset}`);
        item.choices.forEach((element, index) => {
          console.log(`${utility.colors.yellow}[${index + 1}] ${element}${utility.colors.reset}`);
        });
        do {
          // eslint-disable-next-line no-await-in-loop
          response = await getAnswer(item.label, true);
          errorCounter += 1;
        } while (!utility.tryParseInt(response, false)
        || !utility.validChoiceRange(response, item.choices.length));
        utility.clearLine(-(item.choices.length + (2 * errorCounter) + 2));
        responseArray.push({ question: item.label, response });
      } else if (item.type === 'simple-question') {
        response = await getAnswer(item.label, false);
        utility.clearLine(-1);
        responseArray.push({ question: item.label, response });
      }
    }
  }
  rl.close();
  return responseArray;
}

exports.getAnswersFor = async function (questions) {
  const res = await main(questions);
  return res;
};

exports.getAnswersForJson = async function (filename) {
  const result = await jsonQuestion(filename);
  return result;
};

exports.encodeQuestions = utility.encodeQuestions;
exports.decodeQuestions = utility.decodeQuestions;
