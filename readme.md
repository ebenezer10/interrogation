# Interrogation
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

### Version ^0.1.0 : Create a file of questions
You can now create a json file of questions, encode these questions or decode them.

#### Create a question file
Just create a json file with questions structured like below:
```json
[
  {
    "type": "simple-question",
    "label": "Question 1",
    "format": "string"
  },
  {
    "type": "simple-question",
    "label": "Question 2",
    "format": "string"
  },
  {
    "type": "one-choice-mcq",
    "label": "Question 3",
    "choices": ["Choice 1", "Choice 2", "Choice 3"]
  },
  {
    "type": "simple-question",
    "label": "Question 4",
    "format": "number"
  }
]
```
#### Encode a question file
You can encode questions by calling the ```encodeQuestions()``` function.
```javascript
console.log(interrogation.encodeQuestions('json-question.json'));
```
The output is a base64 string.
##### Output
```
WwogIHsKICAgICJ0eXBlIjogInNpbXBsZS1xdWVzdGlvbiIsCiAgICAibGFiZWwiOiAiUXVlc3Rpb24gMSIsCiAgICAiZm9ybWF0IjogInN0cmluZyIKICB9LAogIHsKICAgICJ0eXBlIjogInNpbXBsZS1xdWVzdGlvbiIsCiAgICAibGFiZWwiOiAiUXVlc3Rpb24gMiIsCiAgICAiZm9ybWF0IjogInN0cmluZyIKICB9LAogIHsKICAgICJ0eXBlIjogIm9uZS1jaG9pY2UtbWNxIiwKICAgICJsYWJlbCI6ICJRdWVzdGlvbiAzIiwKICAgICJjaG9pY2VzIjogWyJDaG9pY2UgMSIsICJDaG9pY2UgMiIsICJDaG9pY2UgMyJdCiAgfSwKICB7CiAgICAidHlwZSI6ICJzaW1wbGUtcXVlc3Rpb24iLAogICAgImxhYmVsIjogIlF1ZXN0aW9uIDQiLAogICAgImZvcm1hdCI6ICJudW1iZXIiCiAgfQpd
```
A new file (```question.int```) containing the output is also generated. You can then send this file to anyone interrested in answering your questions. This can be very useful for an investigation or a survey.

#### Decode question file
On the other side, the ```question.int``` file can be decoded by calling the ```decodeQuestions()``` function.
```javascript
console.log(interrogation.decodeQuestions('question.int'));
```
##### Output
```json
[
  {
    "type": "simple-question",
    "label": "Question 1",
    "format": "string"
  },
  {
    "type": "simple-question",
    "label": "Question 2",
    "format": "string"
  },
  {
    "type": "one-choice-mcq",
    "label": "Question 3",
    "choices": ["Choice 1", "Choice 2", "Choice 3"]
  },
  {
    "type": "simple-question",
    "label": "Question 4",
    "format": "number"
  }
]
```
You can also get answers for encoded file directly by calling the ```getAnswersForJson()``` function.
```javascript
interrogation.getAnswersForJson('question.int').then((value) => {
  console.log(value);
});
```
##### Output
```javascript
[
  { question: 'Question 1', response: 'Response 1' },
  { question: 'Question 2', response: 'Response 2' },
  { question: 'Question 3', response: '3' }, // Choice 3
  { question: 'Question 4', response: 'Response 4' }
]
```
### Future updates
- Support of multiple choices.
- Send encoded files by e-mail.
- Develop a client to answer question (for non-developers).

### Buy me a coffee
<a href="https://www.buymeacoffee.com/ebenjs" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 30px !important;width: 117px !important;" ></a>