// Peer 1
const localConnection = new RTCPeerConnection(); 

const dataChannel = localConnection.createDataChannel("info_channel"); 
dataChannel.onmessage = e => console.log("Received Message: " + e.data); 
dataChannel.onopen = e => console.log("Connection Opened!"); 


localConnection.onicecandidate = e => 
    console.log("New ICE Candidate! Reprinting SDP " + JSON.stringify(localConnection.localDescription)); 

localConnection.createOffer().
    then(o => localConnection.setLocalDescription(o)).then(a => console.log("Set successfully!")); 

// After some time. 
const answer = {"type":"answer","sdp":"v=0\r\no=- 2002311589092326692 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 56629 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 192.168.86.57\r\na=candidate:3799710086 1 udp 2122194687 192.168.86.57 56629 typ host generation 0 network-id 1 network-cost 10\r\na=ice-ufrag:1Ju7\r\na=ice-pwd:BjZPUDD+EmFk+/F4Z9AG3FRc\r\na=ice-options:trickle\r\na=fingerprint:sha-256 F4:15:A5:90:02:5B:F1:EA:D4:7D:68:9E:F8:89:C6:05:32:93:0C:37:94:2B:4D:0B:FB:6F:C3:84:12:8C:08:59\r\na=setup:active\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"}; 
localConnection.setRemoteDescription(); 

dataChannel.send("Peer B, what is up?"); 

// Peer 2
const receivedOffer = {"type":"offer","sdp":"v=0\r\no=- 6173772707581177877 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=candidate:3112724013 1 udp 2113937151 9f5fa4cc-74b1-4c9c-8d8d-48080f6ae122.local 54409 typ host generation 0 network-cost 999\r\na=ice-ufrag:CtTy\r\na=ice-pwd:mKXsbMXzawL4SaObVs5sC/j9\r\na=ice-options:trickle\r\na=fingerprint:sha-256 47:DC:8C:08:68:F0:44:37:9B:2A:DE:9D:F9:9E:A6:73:34:C0:33:DF:84:D2:A1:19:C0:5E:89:77:44:A9:F2:63\r\na=setup:actpass\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"}; 

const localConnection = new RTCPeerConnection(); 

localConnection.onicecandidate = e => 
    console.log("New Ice Candidate! Reprinting SDP " + JSON.stringify(localConnection.localDescription))

localConnection.ondatachannel = e => {
    localConnection.datachannel = e.channel; 
    localConnection.datachannel.onmessage = e => console.log("New Message from Client: " + e.data); 
    localConnection.datachannel.onopen = e => console.log("Connection opened!"); 
}

localConnection.setRemoteDescription(receivedOffer).then(a => console.log("Offer set!")); 

localConnection.createAnswer().then(a => 
    localConnection.setLocalDescription(a)).then(a => console.log("Answer created!")); 

// After some time. 
localConnection.datachannel.send("Peer A, fine, what about you?");