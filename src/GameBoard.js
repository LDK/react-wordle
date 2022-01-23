import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

const instancesOf = (needle, haystack) => {
	if (typeof haystack == 'object') {
		haystack = haystack.join('');
	}
	const regex = new RegExp( needle, 'g' );
	const result = haystack.match(regex)
	return result ? result.length : 0;
};

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

const GameBoard = (props) => {
	const { guesses, guessCount, answer, wordLength, endOfLine, guessesUsed, victory } = props;
	let letterRows = [];
	let i = 0;
	while (i < guessCount) {
		letterRows.push(
			<LetterRow key={`guess-row-${i}`} rowNum={i} guesses={guesses} answer={answer} wordLength={wordLength} active={guesses.length - (endOfLine ? 1 : 0)} sent={guessesUsed > i} victory={victory} />
		);
		i++;
	}
	return (
		<Row>
			<Col xs={12}>
				{ letterRows }
			</Col>
		</Row>
	);
};
export default GameBoard;