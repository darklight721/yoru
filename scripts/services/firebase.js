'use strict';

yoruApp.factory('firebase', function() {
  var baseRef = new Firebase('https://darksmint.firebaseio.com'),
  		roomsRef = baseRef.child('rooms'),
		roomRef = null,
		userRef = null,
		userName = 'Unknown',
		yoruName = 'Yoru';
			
	function pushUserTo(roomRef, callback) {
		if (roomRef) {
			return roomRef.child('users').push({ name: userName }, function(success){
				callback && callback(success);
			});
		}
		callback(false);
		return null;
	}

	function startListeningTo(ref) {
		if (ref) {
			ref.child('messages').limit(20).on('child_added', function(snapshot) {
				$.publish('yoru:response', [snapshot.val()]);
			});
			
			ref.child('users').on('child_removed', function(snapshot) {
				var user = snapshot.val();
				$.publish('yoru:response', [{
					sender: yoruName,
					body: 'A citizen by the name of ' + user.name + ' has left the world. I wonder why...'
				}]);
			});
		}
	}

	function stopListeningTo(ref) {
		if (ref) {
			ref.child('messages').off();
			ref.child('users').off();
		}
	}
			
	return {
		hasRoom: function() {
			return roomRef ? true : false;
		},
		createRoom: function() {
			var deferred = $.Deferred();
			
			if (roomRef) {
				deferred.reject(400);
			}
			else {
				roomRef = roomsRef.push();
				userRef = pushUserTo(roomRef, function(success){
					success ? deferred.resolve() : deferred.reject(500);
				});
				userRef.removeOnDisconnect();
				startListeningTo(roomRef);
			}
			
			return deferred.promise();
		},
		joinRoom: function(id) {
			var deferred = $.Deferred();
			
			if (roomRef) {
				deferred.reject(400);
			}
			else {
				roomsRef.child(id).once('value', function(roomSnapshot){
					var room = roomSnapshot.val();
					if (room) {
						roomRef = roomsRef.child(id);
						userRef = pushUserTo(roomRef, function(success){
							success ? deferred.resolve() : deferred.reject(500);
						});
						userRef.removeOnDisconnect();
						startListeningTo(roomRef);
					}
					else {
						deferred.reject(400);
					}
				});
			}
			
			return deferred.promise();
		},
		leaveRoom: function() {
			var deferred = $.Deferred();
			
			if (roomRef) {
				stopListeningTo(roomRef);
				userRef.remove(function(success){
					success ? deferred.resolve() : deferred.reject(500);
				});
				userRef = null;
				roomRef = null;
			}
			else {
				deferred.reject(400);
			}
			
			return deferred.promise();
		},
		changeName: function(name) {
			var deferred = $.Deferred();
			
			userName = name || userName;
			
			if (userRef) {
				userRef.update({ name: userName }, function(success){
					success ? deferred.resolve() : deferred.reject(500);
				})
			}
			else {
				deferred.resolve();
			}
			
			return deferred.promise();
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
		},
		getUserName: function() {
			return userName;
		}
	};
});