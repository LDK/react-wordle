import React from 'react';
const Notification = (props) => {
	const { timeOut, notificationVisible, notificationMessage, setNotificationVisible } = props;
	if (notificationVisible) {
		setTimeout(() => { if (notificationVisible) { setNotificationVisible(false); } }, timeOut);
	}
	return (
		<div className="notification">
			<span>{ notificationMessage }</span>
		</div>
	);
}
export default Notification;