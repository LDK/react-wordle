import React from 'react';
const ScoreBoard = (props) => {
	const { cookies, defaultScores } = props;
	const scores = cookies.get('wordleCloneScores') || defaultScores;
	const Distribution = () => {
		let scale = 0;
		let i = 1;
		while (i < 7) {
			if (scores[i] > scale) {
				scale = i;
			}
			i++;
		}
		let percentages = {};
		let bars = [];
		i = 1;
		while (i < 7) {
			percentages[i] = Math.round((scores[i] * 10 / scale) * 100) / 10;
			bars.push(
				<div key={`bar-${i}`} className="distribution-bar-tray" rel={i}>
					<div className={`distribution-bar distribution-${i}`} style={{ width: `${percentages[i]}%` }}>
						<span>{ scores[i] }</span>
					</div>
				</div>
			);
			i++;
		}
		return (
			<div className="distribution">
				{ bars }
			</div>
		);
	}
	return (
		<div className="scoreboard">
			<p>Words Seen: { scores.words } ({ scores.success } Wins)</p>
			<p>Average Guesses Needed: { scores.average }</p>
			<h4>Guess Distribution</h4>
			<Distribution />
		</div>
	);
};
export default ScoreBoard;