import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import validWords from "./validWords.json";
import answers from "./answers.json";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const LetterSquare = (props) => {
	const { active, result, letter } = props;
	let activeClass = '';
	if (active) {
		activeClass = ' active';
	}
	return (
		<Col 
			className={`letterSquare pt-2 ${result}${activeClass}`} 
			style={{ color: 'white', fontWeight: 600 }}>
				{ letter || null }
		</Col>
	);
};

const letterMatches = (ltr, word, guess) => {
	let hits = 0;
	for (let wIdx in word) {
		if (word[wIdx] === ltr && guess[wIdx] === ltr) {
			hits += 1;
		}
	}
	return hits;
}

const LetterRow = (props) => {
	const { rowNum, guesses, answer, wordLength, active, sent, victory } = props;
	let offset = rowNum * wordLength;
	let end = offset + wordLength - 1;
	let squares = [];
	let i = offset;
	let lettersSeen = {};
	let wrongsCounted = {};
	const guess = [...guesses].slice(i, i + wordLength);
	const guessWord = guess.join('').toUpperCase();
	while (i <= end) {
		let result = null;
		const gLtr = guesses[i];
		if (!lettersSeen[gLtr]) {
			lettersSeen[gLtr] = 1;
		}
		else {
			lettersSeen[gLtr]++;
		}
		if (gLtr && sent) {
			if (gLtr === answer[i - offset]) {
				result = 'right-spot';
			}
			else if (answer.indexOf(gLtr) !== -1) {
				const instances = instancesOf(gLtr,answer);
				const ltrRight = letterMatches(gLtr,answer,guessWord.toUpperCase());
				const ltrWrongs = instances - ltrRight;
				if (!wrongsCounted[gLtr]) {
					wrongsCounted[gLtr] = 0;
				}
				if (wrongsCounted[gLtr] >= ltrWrongs) {
					result = 'no-spot';
				}
				else {
					result = 'wrong-spot';
					wrongsCounted[gLtr] += 1;
				}
			}
			else {
				result = 'no-spot';
			}
		}
		squares.push(<LetterSquare key={`guess-${i}`} letter={guesses[i]} result={result} active={active === i && !victory} />);
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

const wordLength = 5;
const guessCount = 6;
let wordsSeen = cookies.get('wordleCloneWordsSeen') || [];
let wordChoice = answers[getRandomInt(0,answers.length)].split('');

// If they haven't seen every word and we've picked a word they've already seen, pick until we get an unseen word.
while (wordsSeen.length < answers.length && wordsSeen.indexOf(wordChoice) !== -1) {
	let wordChoice = answers[getRandomInt(0,answers.length)].split('');
}
const picked = wordChoice;

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

const instancesOf = (needle, haystack) => {
	if (typeof haystack == 'object') {
		haystack = haystack.join('');
	}
	const regex = new RegExp( needle, 'g' );
	const result = haystack.match(regex)
	return result ? result.length : 0;
};

const App = () => {
	const [answer, setAnswer] = useState(picked);
	const [guesses, setGuesses] = useState([]);
	const [guessesUsed, setGuessesUsed] = useState(0);
	const [victory, setVictory] = useState(false);
	const [failure, setFailure] = useState(false);
	const [notificationVisible, setNotificationVisible] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState(false);
	const [resultMessage, setResultMessage] = useState(null);
	const [lettersGuessed, setLettersGuessed] = useState({});
	const endOfLine = guesses.length && (guesses.length % wordLength === 0) && guessesUsed < Math.floor(guesses.length / wordLength);
	const startOfLine = !guesses.length || ((guesses.length % wordLength === 0) && guessesUsed >= Math.floor(guesses.length / wordLength));

	useEffect(() => {
		window.onkeydown=(e) => { handleKeyDown(e.key); };
	})

	const Notification = (props) => {
		const { timeOut } = props;
		if (notificationVisible) {
			setTimeout(() => { if (notificationVisible) { setNotificationVisible(false); } }, timeOut);
		}
		return (
			<div className={ "notification " + (notificationVisible ? 'opacity-100' : 'opacity-0') }>{ notificationMessage }</div>
		);
	}

	let letterRows = [];
	let i = 0;
	while (i < guessCount) {
		letterRows.push(
			<LetterRow key={`guess-row-${i}`} rowNum={i} guesses={guesses} answer={answer} wordLength={wordLength} active={guesses.length - (endOfLine ? 1 : 0)} sent={guessesUsed > i} victory={victory} />
		);
		i++;
	}
	const handleLetter = (ltr) => {
		if (notificationVisible) { 
			setNotificationVisible(false); 
		}
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
	const addWordSeen = (word) => {
		const list = cookies.get('wordleCloneWordsSeen');
		let newList = list ? [...list, word] : [word];
		cookies.set('wordleCloneWordsSeen',newList);
	}
	const checkVictory = () => {
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
				setVictory(true);
				setResultMessage(<p className="result-message pt-2 pb-3">You got the answer in {guessesUsed + 1} tries!  Press Enter for a new word.</p>);
				addWordSeen(answer.join(''));
			}
			else if (j >= guessCount) {
				setFailure(true);
				setResultMessage(<p className="result-message pt-2 pb-3">Sorry, the answer was "{answer.join('')}."  Press Enter for a new word.</p>);
				addWordSeen(answer.join(''));
			}
		}
		setLettersGuessed(newLettersGuessed);
	};
	const handleEnter = () => {
		if (!endOfLine) {
			setNotificationMessage("Not enough letters.");
			setNotificationVisible(true);
			return;
		}
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
		setFailure(false);
		setGuesses([]);
		setGuessesUsed(0);
		setAnswer(answers[getRandomInt(0,answers.length)].split(''));
		setResultMessage(null);
		setLettersGuessed({});
	};
	const keyRows = [
		['Q','W','E','R','T','Y','U','I','O','P',{ key: 'Backspace', label: '← Bk', className: 'd-none d-sm-inline-block actionKey' },{ key: 'Backspace', label: '←', className: 'd-sm-none actionKey' }],
		['A','S','D','F','G','H','J','K','L'],
		['Z','X','C','V','B','N','M',{ key: 'Enter', label: 'Enter ⏎', className: 'd-none d-sm-inline-block actionKey' },{ key: 'Enter', label: '⏎', className: 'd-sm-none actionKey' }]
	];
	let keyBtnRows = [];
	for (var k in keyRows) {
		let myRow = [];
		for (var keyIdx in keyRows[k]) {
			let label = keyRows[k][keyIdx];
			let keyVal = label;
			let classes = '';
			if (typeof label == 'object') {
				keyVal = label.key;
				classes = label.className;
				label = label.label;
			}
			myRow.push(<div key={`kbd-key-${keyIdx}`} className={"py-1 px-1 px-sm-2 mb-2 keyButton d-inline-block " + classes} data-result={lettersGuessed[label] || 'unguessed'} style={{ color: '#333', border: '#ACACAC', borderRadius: '.25rem' }} onClick={ () => { handleKeyDown(keyVal) } }>{ label }</div>);
		}
		keyBtnRows.push(
			<div key={`kbd-row-${k}`} className="pt-2">{ myRow }</div>
		)
	}
	return (
		<Container fluid="sm" tabIndex={1} className="h-100 text-center pt-2 pt-md-3 pt-lg-4 px-0 px-sm-4"> 
			<header className="d-sm-none d-md-block">
				<h3 className="mt-md-4 mt-lg-5">A <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a> clone built in React</h3>
				<p className="mt-1 mt-md-2 mb-0">By Daniel Swinney</p>
				<a className="d-block mt-0 mb-3 mb-md-4 small" href="https://github.com/LDK/react-wordle/">GitHub repo</a>
			</header>
			<Container className="App" style={{ maxWidth: '480px', backgroundColor: '#003300' }}>
				<Row>
					<Col xs={12}>
						{ letterRows }
					</Col>
				</Row>
				<Row className="onscreenKeyboard">
					{ keyBtnRows }
				</Row>
				<Notification timeOut={2500} />
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
