import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { isMobile } from 'react-device-detect';

const ResultMessage = (props) => {
	const { result, guessesUsed, newGame, answer, resultsClosed, setResultsClosed } = props;
	const CTA = isMobile ? '' : ' Press Enter for a new word.';
	let resultMessage = '';
	switch (result) {
		case 'victory':
			resultMessage = `You got the answer in ${guessesUsed} tries!${CTA}`;
		break;
		case 'failure':
			resultMessage = `Sorry, the answer was "${answer.join('')}"${CTA}`;
		break;
		default: 
		break;
	}
	return (
		<Modal
			className={`result-modal ${result}`}
			keyboard={true}
			backdrop={true}
			show={result && !resultsClosed}
			onHide={() => { setResultsClosed(true) }}
			centered
			size="auto"
		>
			{ !isMobile && <Modal.Header closeButton /> }
			<Modal.Body>
				<p className="result-message px-2 py-4 text-center fw-600 m-0">
					{ resultMessage }
					{ isMobile && <Button onClick={newGame} variant="primary">New Word</Button> }
				</p>
			</Modal.Body>
		</Modal>
	);
};

export default ResultMessage;