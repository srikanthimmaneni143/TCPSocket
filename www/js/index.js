/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

var My_ip = "192.168.43.15";
var My_ip2 = "127.0.0.1";
var My_port = 55555;
var socketId = null;

//Helper functions
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
  
  function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

stringToBuffer = function(string) {

	var buffer = new ArrayBuffer(string.length)
	var bufferView = new Uint8Array(buffer)
	
	for (var i = 0; i < string.length; ++i) {

		bufferView[i] = string.charCodeAt(i)
	}

	return buffer
}

bufferToString = function(buffer) {

	return String.fromCharCode.apply(null, new Uint8Array(buffer))
}



document.addEventListener('deviceready', onDeviceReady, false);
document.getElementById("connectid").addEventListener("click", Connect);
document.getElementById("Disconnectid").addEventListener("click", Disconnect);
document.getElementById("Sendid").addEventListener("click", Senddata);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    alert("Device ready");
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

}

function Senddata(){
    //    var dataString = document.getElementById("fname").val;
//    alert("In sendata function");
    var dataString = document.getElementById("SendData").value;
//    alert("In n4567");
        var arrayBuffer = stringToBuffer(dataString);
    //    connectAndSend(arrayBuffer);
//    alert("In n48979223");
    
        chrome.sockets.tcp.send (
            socketId,
            arrayBuffer,
            function(sendInfo) {
//                alert("Senddata func inn");
                if (sendInfo.resultCode < 0) {
                    var errorMessage = 'Failed to send data';
                    console.log(errorMessage);
                    alert(errorMessage);
                }
                else{
                    alert("Data sent successfully");
                }
            }	
        )
}
    

function connectedCallback(result) {
///    alert("In Connected function");

    if (result == 0) {
         console.log('Connected to ' + My_ip);
//         alert('Connected to ' + My_ip);                        
    }
    else {
        var errorMessage = 'Failed to connect to ' + My_ip;
        alert('Failed to connect to ' + My_ip);
        console.log(errorMessage);
//        navigator.notification.alert(errorMessage, function() {})
    }
}

function Connect(){
    //    socketId = document.getElementById("myInput").value;
//        alert("Connect fuction");
        My_ip = document.getElementById("ipnu").value;
        My_port = Number(document.getElementById("portnu").value);
 //       document.getElementById("RecvData").innerHTML = "HA HA"
 //       alert("IN connect function()");
        chrome.sockets.tcp.create(function(createInfo) {
            socketId = createInfo.socketId; 
            alert("Socket created");
            chrome.sockets.tcp.connect(
                socketId,
                My_ip,
                My_port,
                connectedCallback)
        })       
//        alert(socketId);
    
}


function Disconnect() {
//    alert("IN Disconnect function");
	chrome.sockets.tcp.close(socketId, function() {
        console.log('TCP Socket close finished.');
        alert("Disconnected");
	})

}

chrome.sockets.tcp.onReceive.addListener(
    function (info) {
        alert("In data receive function");
       if (info.data)
            console.log(ab2str(info.data));
            alert(ab2str(info.data));
            document.getElementById("RecvData").innerHTML = info.data;
    }
)


