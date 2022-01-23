import React from 'react';
import { CSSTransition } from 'react-transition-group';
const Notification = (props) => {
	const { timeOut, notificationVisible, notificationMessage, setNotificationVisible } = props;
	const nodeRef = React.useRef(null);
	if (notificationVisible) {
		setTimeout(() => { if (notificationVisible) { setNotificationVisible(false); } }, timeOut);
	}
	return (
		<CSSTransition in={notificationVisible} timeout={300} classNames="notification" nodeRef={nodeRef}>
			<div className="notification" ref={nodeRef}>
				<span>{ notificationMessage }</span>
			</div>
		</CSSTransition>
	);
}
export default Notification;