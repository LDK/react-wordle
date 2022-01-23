import React from 'react';
import Row from 'react-bootstrap/Row';
const ScreenKeyboard = (props) => {
	const { handleKeyDown, lettersGuessed } = props;
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
		<Row className="onscreenKeyboard">
			{ keyBtnRows }
		</Row>		
	);
};
export default ScreenKeyboard;