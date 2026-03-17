const WS_URL =
	process.env.NEXT_PUBLIC_SERVER?.replace("http://", "wss://") ||
	"ws://localhost:8000";

export default function usePostTopLiveSocket(handle: string) {
	let ws: WebSocket | null = null;
	const onVideoUpdateCallbacks: Array<(data: any) => void> = [];

	function connect() {
		ws = new WebSocket(WS_URL);

		ws.onopen = () => {
			console.log("WebSocket connection opened");
		};

		ws.onmessage = (event) => {
			console.log("WebSocket message received:", event.data);
			const { d, op } = JSON.parse(event.data.toString());
			if (op === 100) {
				// Declare Intent - Evesdrop
				if (!ws) return;
				ws.send(
					JSON.stringify({
						op: 2,
						d: {
							handle: handle,
						},
					}),
				);
			} else if (op === 105) {
				// Currently Listening Data
				for (const callback of onVideoUpdateCallbacks) {
					callback(d);
				}
			}
		};

		ws.onclose = () => {
			console.log("WebSocket connection closed, reconnecting...");
			setTimeout(connect, 1000);
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
			if (!ws) return;
			ws.close();
		};
	}

	function disconnect() {
		if (ws) {
			ws.close();
			ws = null;
		}
	}

	return {
		connect,
		onVideoUpdate: (callback: (data: any) => void) => {
			onVideoUpdateCallbacks.push(callback);
		},
		disconnect,
	};
}
