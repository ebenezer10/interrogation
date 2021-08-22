const readline = require('readline');
const fs = require('fs');

const simpleQuestionKeys = ['type', 'label', 'format'];
const oneChoiceMcqKeys = ['type', 'label', 'choices'];
const questionsTypes = ['simple-question', 'one-choice-mcq'];
const questionsFormats = ['string', 'number'];
const colors = {
  reset: '\x1b[0m',
  // text color
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  // background color
  blackBg: '\x1b[40m',
  redBg: '\x1b[41m',
  greenBg: '\x1b[42m',
  yellowBg: '\x1b[43m',
  blueBg: '\x1b[44m',
  magentaBg: '\x1b[45m',
  cyanBg: '\x1b[46m',
  whiteBg: '\x1b[47m',
};

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function clearLine(linePosition) {
  process.stdout.moveCursor(0, linePosition);
  process.stdout.clearLine();
  // process.stdout.write('\x1Bc\r');
}

function getAnswer(question, mcq) {
  return new Promise((success, error) => {
    if (mcq) {
      rl.question('', (answer) => {
        success(answer);
      }, () => {
        error();
      });
    } else {
      rl.question(`${colors.green}${question}${colors.reset}`, (answer) => {
        success(answer);
      }, () => {
        error();
      });
    }
  });
}

function tryParseInt(value, defaultValue) {
  let retValue = defaultValue;
  if (value !== null) {
    if (value.length > 0) {
      retValue = parseInt(value, 10);
      if (Number.isNaN(retValue)) {
        console.log(`${colors.red}Error : enter a valid number${colors.reset}`);
        retValue = false;
      }
    }
  }
  return retValue;
}

function validChoiceRange(response, total) {
  if (response >= total + 1) {
    console.log(`${colors.red}Error : enter a valid choice number${colors.reset}`);
    return false;
  }
  return true;
}

let response;
const responseArray = [];
async function main(questions) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of questions) {
    if (Array.isArray(item)) {
      console.log(`${colors.green}${item[0]}${colors.reset}`);
      item[1].forEach((element, index) => {
        console.log(`${colors.yellow}[${index + 1}] ${element}${colors.reset}`);
      });
      do {
        // eslint-disable-next-line no-await-in-loop
        response = await getAnswer(item[0], true);
      } while (!tryParseInt(response, false) || !validChoiceRange(response, item[1].length));
      clearLine(-(item[1].length + 2));
      responseArray.push({ question: item[0], response });
    } if (typeof (item) === 'string') {
      response = await getAnswer(item, false);
      clearLine(-1);
      responseArray.push({ question: item, response });
    }
  }
  rl.close();
  return responseArray;
}

function jsonQuestionValidate(content) {
  const obj = JSON.parse(content);
  obj.forEach((item) => {
    if (!Array.isArray(item)) {
      if (questionsTypes.includes(item.type)) {
        if (item.label.trim() !== '') {
          const keys = Object.keys(item);
          if (item.type === 'simple-question') {
            if (questionsFormats.includes(item.format)) {
              keys.forEach((key) => {
                if (!simpleQuestionKeys.includes(key)) {
                  throw Error(`Invalid key found : ${key}`);
                }
              });
            } else {
              throw Error('Invalid format');
            }
          } else if (item.type === 'one-choice-mcq') {
            if (keys.includes('choices')) {
              if (Array.isArray(item.choices)) {
                keys.forEach((key) => {
                  if (!oneChoiceMcqKeys.includes(key)) {
                    throw Error(`Invalid key found : ${key}`);
                  }
                });
              } else {
                throw Error('Choices must be put in array');
              }
            } else {
              throw Error('Choices are not mandatory for mcq type');
            }
          }
        } else {
          throw Error('Question label cannot be empty');
        }
      } else {
        throw Error('Unrecognized type');
      }
    } else {
      throw Error('Nested objects cannot be array');
    }
  });

  return true;
}

exports.getAnswersFor = async function (questions) {
  const res = await main(questions);
  return res;
};

exports.getAnswersForJson = async function () {
  const content = fs.readFileSync('json-question.json', 'utf8');
  if (jsonQuestionValidate(content)) {
    return content;
  }
  return false;
};

exports.encodeQuestions = function (filename) {
  const content = Buffer.from(fs.readFileSync(filename, 'utf8')).toString('base64');
  fs.writeFile('question.int', content, (err) => {
    if (err) throw err;
    console.log('Saved!');
  });
  return content;
};

exports.decodeQuestions = function (filename) {
  const content = Buffer.from(fs.readFileSync(filename, 'utf8'), 'base64').toString('ascii');
  return content;
};
