import React from 'react';
import { InputTextarea } from '@bit/primefaces.primereact.inputtextarea';
import PrimereactStyle from '@bit/primefaces.primereact.internal.stylelinks';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:8000');
class WebSocketBox extends React.Component {
	constructor() {
		super();
		this.state = {
			value: 'WebSocket Text'
		};
	}

	componentWillMount() {
		client.onopen = () => {
		  console.log('WebSocket Client Connected');
		};
		client.onmessage = (message) => {
			var {value} = this.state;
			const dataFromServer = JSON.parse(message.data);
			console.log(dataFromServer);
			value = value + "\n" + dataFromServer.message;
			this.setState({value});
		};
	  }

	render() {
		return (
			<div
			>
				<PrimereactStyle />
				<InputTextarea
					value={this.state.value}
					readOnly={true}
					rows={5}
					// cols={30}
					style={{height : "150px"}}
				/>
			</div>
		);
	}
}

export default WebSocketBox;
