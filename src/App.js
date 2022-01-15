import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
// import validWords from "./validWords.json";
import answers from "./answers.json";

const LetterSquare = (props) => {
  const { active, result, letter } = props;
  let activeClass = '';
  if (active) {
    activeClass = ' active';
  }
  return (
    <Col className={`letterSquare pt-2 ${result}${activeClass}`} style={{ color: 'white', fontWeight: 600 }}>{ letter || null }</Col>
  );
};

const LetterRow = (props) => {
  const { rowNum, guesses, answer, wordLength, active, sent, victory } = props;
  let offset = rowNum * wordLength;
  let end = offset + wordLength - 1;
  let squares = [];
  let i = offset;
  while (i <= end) {
	  let result = null;
	  if (guesses[i] && sent) {
		  if (guesses[i] === answer[i - offset]) {
			result = 'right-spot';
		  }
		  else if (answer.indexOf(guesses[i]) !== -1) {
			  result = 'wrong-spot';
		  }
		  else {
			  result = 'no-spot';
		  }
	  }
	  squares.push(<LetterSquare letter={guesses[i]} result={result} active={active === i && !victory} />);
	  i++;
  }  
  return (
  	<Row>
	  { squares }
	  </Row>
  );
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

const picked = answers[getRandomInt(0,answers.length)].split('');

function App() {
  const wordLength = 5;
  const guessCount = 6;
  // const [answer, setAnswer] = useState(['U','N','C','L','E']);
  const [answer, setAnswer] = useState(picked);
  const [guesses, setGuesses] = useState([]);
  const [guessesUsed, setGuessesUsed] = useState(0);
  const [victory, setVictory] = useState(false);
  const [failure, setFailure] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const endOfLine = guesses.length && (guesses.length % wordLength === 0) && guessesUsed < Math.floor(guesses.length / wordLength);
  const startOfLine = !guesses.length || ((guesses.length % wordLength === 0) && guessesUsed >= Math.floor(guesses.length / wordLength));
  let letterRows = [];
  let i = 0;
  while (i < guessCount) {
	  letterRows.push(
        <LetterRow rowNum={i} guesses={guesses} answer={answer} wordLength={wordLength} active={guesses.length - (endOfLine ? 1 : 0)} sent={guessesUsed > i} victory={victory} />
	  );
	  i++;
  }
  const handleLetter = (ltr) => {
	  setGuesses(guesses => [...guesses, ltr]);
  };
  const handleBackSpace = () => {
	  if (startOfLine) {
		  return;
	  }
	  let newInput = [...guesses];
	  newInput.pop();
	  setGuesses(newInput);
  };
  const checkVictory = () => {
	  let i = 0;
	  let j = 0;
	  while (i < guesses.length) {
		  let guess = guesses.slice(i, i + wordLength);
		  console.log('guesses',guesses,'guess',guess);
		  i += wordLength;
		  j++;
		  if (answer.join() === guess.join()) {
			  setVictory(true);
			  setResultMessage(<p className="result-message">You got the answer in {guessesUsed} tries!  Press Enter for a new word.</p>);
		  }
		  else if (j >= guessCount) {
			  setFailure(true);
			  setResultMessage(<p className="result-message">Sorry, the answer was "{answer.join('')}."  Press Enter for a new word.</p>);
		  }
		  else {
			  console.log('Incorrect guess',guess.join(),'Guesses used',j);
		  }
	  }
	  
  };
  const handleEnter = () => {
	  if (!endOfLine) {
	  	// TODO: Send "not enough letters message"
		  return;
	  }
	  setGuessesUsed(guessesUsed + 1);
	  checkVictory();
  };
  const handleKeyDown = (key) => {
	  if (key === 'Enter') {
		  if (victory || failure) {
			  newGame();
			  return;
		  }
		  handleEnter();
		  return;
	  }
	  if (victory) {
		  return;
	  }
	  const isLetter = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(key) !== -1;
	  if (isLetter && !endOfLine) {
		  handleLetter(key.toUpperCase());
		  return;
	  }
	  if (key === 'Backspace') {
		  handleBackSpace();
		  return;
	  }
  };
  const newGame = () => {
  	setVictory(false);
	setGuesses([]);
	setGuessesUsed(0);
	setAnswer(answers[getRandomInt(0,answers.length)].split(''));
	setResultMessage(null);
  };
  return (
	  <Container fluid={true} tabIndex={1} onKeyDown={(e) => { handleKeyDown(e.key); }} className="h-100"> 
		<Container className="App" style={{ maxWidth: '420px', backgroundColor: '#003300' }}>
	    	<Row>
			  <Col xs={12}>
				  { letterRows }
			  </Col>
			</Row>
		  { resultMessage &&
		  	<Row>
			  <Col xs={12} className="p-0">
			  { resultMessage }
			  </Col>
			  </Row>
		  }
		</Container>
	</Container>
  );
}

export default App;
