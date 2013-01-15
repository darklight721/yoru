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

	function startListeningTo(ref) {
		ref.on('child_added', function(snapshot) {
			$.publish('yoru:response', [snapshot.val()]);
		});
	}

	function stopListeningTo(ref) {
		ref.off('child_added');
	}
			
	return {
		createRoom: function(callback) {
			roomRef = roomsRef.push();
			userRef = pushUserTo(roomRef, callback);
			userRef.removeOnDisconnect();

			startListeningTo(roomRef.child('messages'));
		},
		joinRoom: function(id, callback) {
			roomsRef.child(id).once('value', function(roomSnapshot){
				var room = roomSnapshot.val();
				if (room) {
					roomRef = roomsRef.child(id);
					userRef = pushUserTo(roomRef, callback);
					userRef.removeOnDisconnect();

					startListeningTo(roomRef.child('messages'));
				}
			});
		},
		leaveRoom: function(callback) {
			if (!roomRef) return;

			stopListeningTo(roomRef.child('messages'));
			userRef.remove();
			userRef = null;

			callback && callback();
		},
		sendMessage: function(messageBody, options) {
			options = options || {};

			var message = {
				sender: options.asYoru ? yoruName : userName,
				body: messageBody
			};

			if (options.dontBroadcast) {
				$.publish('yoru:response', [message]);
			}
			else if (roomRef) {
				roomRef.child('messages').push(message);
			}
			else {
				message.sender = yoruName;
				message.body = 'You have not acquired your citizenship yet.';
				$.publish('yoru:response', [message]);
			}
		},
		getRoomId: function() {
			return roomRef ? roomRef.name() : null;
		}
	};
});