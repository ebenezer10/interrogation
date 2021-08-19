import interrogation from './index.cjs';

interrogation.getAnswersFor(['question1? ', 'question2? ', ['question3', ['choice1', 'choice2', 'choice3']]]).then((value) => {
  console.log(value);
});
