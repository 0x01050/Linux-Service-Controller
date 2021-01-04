import React from 'react';
import { InputTextarea } from '@bit/primefaces.primereact.inputtextarea';
import PrimereactStyle from '@bit/primefaces.primereact.internal.stylelinks';
import { w3cwebsocket as W3CWebSocket } from "websocket";

class WebSocketBox extends React.Component {
	constructor() {
		super();
		this.state = {
			websocketMsg: []
		};
	}

	componentDidMount() {
		const { webSocketServer, maxWebSocketMsg } = this.props;
		const client = new W3CWebSocket(webSocketServer);
		client.onopen = () => {
		  console.log('WebSocket Client Connected');
		};
		client.onmessage = (message) => {
			var { websocketMsg } = this.state;
			const dataFromServer = JSON.parse(message.data);
			websocketMsg.unshift(dataFromServer);
			websocketMsg.splice(maxWebSocketMsg, 1);
			this.setState({ websocketMsg });
		};
	  }

	render() {
		var { websocketMsg } = this.state;
		const textareaValue = websocketMsg.map(el => el.message).join('\n');
		return (
			<div
			>
				<PrimereactStyle />
				<InputTextarea
					value={textareaValue}
					readOnly={true}
					rows={5}
					style={{height : "150px"}}
				/>
			</div>
		);
	}
}

export default WebSocketBox;
