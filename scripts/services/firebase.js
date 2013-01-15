'use strict';

yoruApp.factory('firebase', function() {
	var baseRef = new Firebase('https://darksmint.firebaseio.com'),
  		roomsRef = baseRef.child('rooms'),
		roomRef = null,
		userRef = null,
		userName = 'Unknown',
		yoruName = 'Yoru';
			
	function pushUserTo(roomRef, callback) {
		return roomRef.child('users').push({ name: userName }, function(){
			callback && callback();
		});
	}
			
	return {
		createRoom: function(callback) {
			roomRef = roomsRef.push();
			userRef = pushUserTo(roomRef, callback);
			userRef.removeOnDisconnect();
		},
		joinRoom: function(id, callback) {
			roomsRef.child(id).once('value', function(roomSnapshot){
				var room = roomSnapshot.val();
				if (room) {
					roomRef = roomsRef.child(id);
					userRef = pushUserTo(roomRef, callback);
					userRef.removeOnDisconnect();
				}
			});
		},
		sendMessage: function(message, asYoru) {
			if (!roomRef) return;
			
			roomRef.child('messages').push({
				sender: asYoru ? yoruName : userName,
				body: message
			});
		}
	};
});