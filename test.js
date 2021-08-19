import interrogation from './index.cjs';

interrogation.getAnswersFor(['question1? ', 'question2? ']).then((value) => {
  console.log(value);
});
