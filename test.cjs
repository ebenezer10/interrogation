const interrogation = require('./index.cjs');

// eslint-disable-next-line max-len
/* interrogation.getAnswersFor(['question1? ', 'question2? ', ['question3', ['choice1', 'choice2', 'choice3']], 'question4? ']).then((value) => {
  console.log(value);
}); */

/* interrogation.getAnswersForJson().then((value) => {
  console.log(`value : ${value}`);
}); */

console.log(interrogation.encodeQuestions('json-question.json'));

/* interrogation.getAnswersForJson('question.int').then((value) => {
  console.log(value);
}); */
