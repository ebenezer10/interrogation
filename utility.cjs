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

exports.colors = colors;

exports.validChoiceRange = function (response, total) {
  if (response >= total + 1) {
    console.log(`${colors.red}Error : enter a valid choice number${colors.reset}`);
    return false;
  }
  return true;
};

exports.clearLine = function (linePosition) {
  process.stdout.moveCursor(0, linePosition);
  process.stdout.clearLine();
  // process.stdout.write('\x1Bc\r');
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

exports.tryParseInt = function (value, defaultValue) {
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
};

exports.jsonQuestionValidate = function (content) {
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
};
