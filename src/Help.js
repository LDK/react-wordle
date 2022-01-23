import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { isMobile } from 'react-device-detect';

const Help = (props) => {
	const { helpVisible, setHelpVisible } = props;
	return (
		<Modal
			className="help-modal"
			keyboard={true}
			backdrop={true}
			show={helpVisible}
			onHide={() => { setHelpVisible(false) }}
			centered
			size="lg"
			>
				<Modal.Header closeButton>
					<span>Rules & Gameplay</span>
				</Modal.Header>
				<Modal.Body>
					<h4>Rules of Wordle</h4>

					<ul className="bullet-points">
						<li>You have 6 attempts to guess a 5-letter word.</li>
						<li>The word will be randomly selected from a list of 2,315 words.</li>
						<li>Each guess must be a valid 5-letter word.</li>
						<li>After a valid guess is submitted, any letters in the correct spot will be highlighted green.</li>
						<li>Any letters in the guess that are also in the answer but not in the correct spot will be highlighted yellow.</li>
						<li>Letters in the guess that are not in the answer at all will have a grey background.</li>
					</ul>

					<h4>Gameplay</h4>

					{ isMobile ?
						(<ul className="bullet-points">
							<li>When the game loads, you may immediately start guessing by typing on the on-screen keyboard.</li>
							<li>Keys on the keyboard will change background colors corresponding with their results from guesses.</li>
							<li>In this version of Wordle, you may play as many games as you like.</li>
							<li>Tap the bar-graph icon in the upper right of the screen to see your play statistics.</li>
						</ul>)
						:
						(<ul className="bullet-points">
							<li>When the game loads, you may immediately start guessing by typing on your computer keyboard or the on-screen keyboard within the app.</li>
							<li>Keys on the on-screen keyboard will change background colors corresponding with their results from guesses.</li>
							<li>In this version of Wordle, you may play as many games as you like.  After finishing one word, press enter for a new one.</li>
							<li>Click the bar-graph icon in the upper right of the screen to see your play statistics.</li>
						</ul>)
					}
				</Modal.Body>
		</Modal>
	);
};
export default Help;

