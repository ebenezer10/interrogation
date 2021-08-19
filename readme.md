# Interrogation
---
A tiny library that allows you to ask a series of questions to the user in the console.

## Features
- Ask question
- Ask MCQ questions
- Get response from user
- Supports coloring

## How it works

### Install
```shell
npm install interrogation
```
### Import the library

```javascript
const interrogation = require('interrogation')
```
### Ask a question
An array of questions is required for the use of the function ```getAnswersFor()```.

``` javascript
const interrogation = require('interrogation')

interrogation.getAnswersFor(['question1? ', 'question2? ']).then((value) => {
    console.log(value);
});
```
To ask a MCQ (multiple choice question), wrap your question and it's possible choices in an array and pass it to the ```getAnswersFor()``` function.

```javascript
interrogation.getAnswersFor(['question1? ', 'question2? ', ['question3', ['choice1', 'choice2', 'choice3']]]).then((value) => {
  console.log(value);
});
```

### Get response
The response of an interrogation is an array of objects structured like this :

```javascript
[
  { question: 'Question1 ', response: 'Response1' },
  { question: 'Question2 ', response: 'Response2' },
  { question: 'Question3', response: '2' } // choice 2
]
```
### Buy me a coffee
<a href="https://www.buymeacoffee.com/ebenjs" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>