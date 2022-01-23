import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import validWords from "./validWords.json";
import answers from "./answers.json";
import Cookies from 'universal-cookie';
import StatsBox from './StatsBox.js';
import Help from './Help.js';
import ResultMessage from './ResultMessage.js';
import GameBoard from './GameBoard.js';
import Notification from './Notification.js';
import ScreenKeyboard from './ScreenKeyboard.js';
import { ReactComponent as StatsIcon } from './svg/graph.svg';
import { ReactComponent as HelpIcon } from './svg/help.svg';

const cookies = new Cookies();
const getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

// 6 attempts to guess a 5-letter word.
const wordLength = 5;
const guessCount = 6;

let wordsSeen = cookies.get('wordleCloneWordsSeen') || [];
let wordChoice = answers[getRandomInt(0,answers.length)].split('');

// If they haven't seen every word and we've picked a word they've already seen, pick until we get an unseen word.
while (wordsSeen.length < answers.length && wordsSeen.indexOf(wordChoice) !== -1) {
	wordChoice = answers[getRandomInt(0,answers.length)].split('');
}
const picked = wordChoice;

// We track how many of each letter are in the answer.
let wordIndex = 0;
let letterCounts = {};
while (wordIndex < wordLength) {
	let ltr = picked[wordIndex];
	if (letterCounts[ltr]) {
		letterCounts[ltr]++
	}
	else {
		letterCounts[ltr] = 1;
	}
	wordIndex++;
}

const App = () => {
	const [answer, setAnswer] = useState(picked);
	const [guesses, setGuesses] = useState([]);
	const [guessesUsed, setGuessesUsed] = useState(0);
	const [result, setResult] = useState(null);
	const [statsVisible, setStatsVisible] = useState(false);
	const [helpVisible, setHelpVisible] = useState(false);
	const [notificationVisible, setNotificationVisible] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState(false);
	const [lettersGuessed, setLettersGuessed] = useState({});
	const [resultsClosed, setResultsClosed] = useState(false);
	const endOfLine = guesses.length && (guesses.length % wordLength === 0) && guessesUsed < Math.floor(guesses.length / wordLength);
	const startOfLine = !guesses.length || ((guesses.length % wordLength === 0) && guessesUsed >= Math.floor(guesses.length / wordLength));
	const handleLetter = (ltr) => {
		if (notificationVisible) { 
			setNotificationVisible(false); 
		}
		setGuesses(guesses => [...guesses, ltr]);
	};
	const handleEnter = () => {
		if (!endOfLine) {
			setNotificationMessage("Not enough letters.");
			setNotificationVisible(true);
			return;
		}
		checkResult();
	};
	const handleBackSpace = () => {
		if (startOfLine) {
			return;
		}
		let newInput = [...guesses];
		newInput.pop();
		setGuesses(newInput);
	};
	const defaultScores = {
		words: 0,
		success: 0,
		guesses: 0,
		average: null,
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0
	};
	const addWordSeen = (word, success) => {
		const list = cookies.get('wordleCloneWordsSeen');
		let newList = list ? [...list, word] : [word];
		cookies.set('wordleCloneWordsSeen',newList);
		const scores = cookies.get('wordleCloneScores') || defaultScores;
		let newScores = {};
		newScores.words = scores.words + 1;
		newScores.guesses = scores.guesses + guessesUsed + 1;
		newScores.average = Math.round(newScores.guesses / newScores.words);
		let i = 1;
		while (i < 7) {
			if (i === guessesUsed + 1) {
				newScores[i] = scores[i] + 1;
			}
			else {
				newScores[i] = scores[i];
			}
			i++;
		}
		newScores.success = scores.success + (success ? 1 : 0);
		cookies.set('wordleCloneScores',newScores);
	}
	const checkResult = () => {
		let i = 0;
		let j = 0;
		let newLettersGuessed = {};
		while (i < guesses.length) {
			let guess = [...guesses].slice(i, i + wordLength);
			let guessWord = guess.join('').toLowerCase();
			if (validWords.indexOf(guessWord) === -1) {
				let newGuesses = [...guesses].slice(0,i);
				setGuesses(newGuesses);
				setGuessesUsed(newGuesses.length / wordLength);
				setNotificationMessage(guessWord.toUpperCase() + " is not a valid word.");
				setNotificationVisible(true);
				return;
			}
			i += wordLength;
			j++;
			for (let guessIdx in guess) {
				let gLtr = guess[guessIdx];
				if (answer.indexOf(gLtr) === -1) {
					newLettersGuessed[gLtr] = 'none';
				}
				else if (answer[guessIdx] === gLtr) {
					newLettersGuessed[gLtr] = 'right';
				}
				else if (!newLettersGuessed[gLtr]) {
					newLettersGuessed[gLtr] = 'wrong';
				}
			}
			setGuessesUsed(guessesUsed + 1);
			if (answer.join() === guess.join()) {
				setResult('victory');
				addWordSeen(answer.join(''),true);
			}
			else if (j >= guessCount) {
				setResult('failure');
				addWordSeen(answer.join(''),false);
			}
		}
		setLettersGuessed(newLettersGuessed);
	};
	const handleKeyDown = (key) => {
		if (statsVisible) {
			return;
		}
		if (key === 'Enter') {
			if (result) {
				newGame();
				return;
			}
			handleEnter();
			return;
		}
		if (result) {
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
		setResult(null);
		setResultsClosed(false);
		setGuesses([]);
		setGuessesUsed(0);
		setAnswer(answers[getRandomInt(0,answers.length)].split(''));
		setLettersGuessed({});
	};
	useEffect(() => {
		window.onkeydown=(e) => { handleKeyDown(e.key); };
	});
	return (
		<Container fluid="sm" tabIndex={1} className="h-100 text-center pt-2 pt-sm-0 pt-md-5 pt-lg-4 px-0 px-sm-4"> 
			<nav>
				<span className="button-icon" onClick={() => { setStatsVisible(!statsVisible); }}><StatsIcon /></span>
				<span className="button-icon" onClick={() => { setHelpVisible(!helpVisible); }}><HelpIcon /></span>
			</nav>
			<header className="d-sm-none d-md-block">
				<h3 className="mt-5 mt-md-4 mt-lg-5">A <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a> clone built in React</h3>
				<p className="mt-1 mt-md-2 mb-0">By Daniel Swinney</p>
				<a className="d-block mt-0 mb-3 mb-md-4 small" href="https://github.com/LDK/react-wordle/">GitHub repo</a>
			</header>
			<Container className="App">
				<GameBoard 
					guesses={guesses}
					guessCount={guessCount}
					answer={answer}
					wordLength={wordLength}
					endOfLine={endOfLine}
					guessesUsed={guessesUsed}
					result={result}
				/>
				<ScreenKeyboard 
					handleKeyDown={handleKeyDown} 
					lettersGuessed={lettersGuessed} 
				/>
				<Notification 
					timeOut={1500} 
					notificationVisible={notificationVisible}
					notificationMessage={notificationMessage}
					setNotificationVisible={setNotificationVisible} 
				/>
				<ResultMessage
					result={result}
					newGame={newGame}
					guessesUsed={guessesUsed}
					answer={answer}
					resultsClosed={resultsClosed}
					setResultsClosed={setResultsClosed}
				/>
			</Container>
			<StatsBox 
				statsVisible={statsVisible}
				setStatsVisible={setStatsVisible}
				cookies={cookies}
				defaultScores={defaultScores}
				/>
			<Help 
				helpVisible={helpVisible}
				setHelpVisible={setHelpVisible}
				/>
		</Container>
	);
}

export default App;
