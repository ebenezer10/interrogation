const readline = require('readline');

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
  if (response >= total) {
    console.log(`${colors.red}Error : enter a valid choice number${colors.reset}`);
    return false;
  }
  return true;
}

let response;
const responseArray = [];
async function mainFunc(questions) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of questions) {
    if (Array.isArray(item)) {
      item[1].forEach((element, index) => {
        console.log(`${colors.yellow}[${index}] ${element}${colors.reset}`);
      });
      do {
        // eslint-disable-next-line no-await-in-loop
        response = await getAnswer(item[0], true);
      } while (!tryParseInt(response, false) || !validChoiceRange(response, item[1].length));
      responseArray.push({ question: item[0], response });
    } if (typeof (item) === 'string') {
      response = await getAnswer(item, false);
      responseArray.push({ question: item, response });
    }
  }
  rl.close();
  return responseArray;
}

exports.getAnswersFor = async function (questions) {
  const res = await mainFunc(questions);
  return res;
};
