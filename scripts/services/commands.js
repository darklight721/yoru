'use strict';

yoruApp.factory('commands', ['firebase', '$location', function(firebase, $location) {

  // Public API here
	return [
		{
			command	: "yoru create world",
			desc	: "Lets Yoru create a world for you.",
			regex	: /^create world/i,
			respond	: function(result) {
				firebase.createRoom()
					.done(function(){
						firebase.sendMessage(
							"Welcome to Planet " + firebase.getRoomId(),
							{ asYoru: true }
						);
					})
					.fail(function(error){
						firebase.sendMessage(
							"Oh dear, there seems to be a problem creating a world for you. Make sure your connection is stable. Also, step out of the planet if you've entered one.",
							{ asYoru: true, dontBroadcast: true }
						);
					});
			}
		},
		{
			command	: "yoru join world [id]",
			desc	: "Lets Yoru join you to a world identified by [id].",
			regex	: /^join world (.+)/i,
			respond	: function(result) {
				firebase.joinRoom(result[1])
					.done(function(){
						firebase.sendMessage(
							"Let's welcome our newest citizen " + firebase.getUserName(),
							{ asYoru: true }
						);
					})
					.fail(function(error){
						firebase.sendMessage(
							"I can't seem to join you to the world. Make sure it's discoverable.",
							{ asYoru: true, dontBroadcast: true }
						);
					});
			}
		},
		{
			command	: "yoru leave world",
			desc	: "Lets Yoru remove you from the world you're in.",
			regex	: /^leave world/i,
			respond	: function(result) {
				firebase.leaveRoom()
					.done(function(){
						firebase.sendMessage(
							"You have just left the world.",
							{ asYoru: true, dontBroadcast: true }
						);
					})
					.fail(function(error){
						firebase.sendMessage(
							"Can't abort you from the world. Sorry.",
							{ asYoru: true, dontBroadcast: true }
						);
					});
			}
		},
		{
			command	: "yoru locate world",
			desc	: "Lets Yoru provide you the URL of your world.",
			regex	: /^locate world/i,
			respond	: function(result) {
				var roomId = firebase.getRoomId();
				if (roomId) {
					firebase.sendMessage(
						$location.absUrl() + firebase.getRoomId(),
						{ asYoru: true, dontBroadcast: true }
					);
				}
				else {
					firebase.sendMessage(
						"Could not locate world.",
						{ asYoru: true, dontBroadcast: true }
					);
				}
			}
		},
		{
			command	: "yoru identify [name]",
			desc	: "Lets Yoru give you a name specified by [name].",
			regex	: /^identify (.+)/i,
			respond	: function(result) {
				var oldName = firebase.getUserName();
				
				if (oldName !== result[1]) {
					firebase.changeName(result[1])
						.done(function(){
							firebase.sendMessage(
								oldName + " has changed his identity to " + result[1],
								{ asYoru: true }
							);
						})
						.fail(function(error){
							firebase.sendMessage(
								"Could not change your name.",
								{ asYoru: true, dontBroadcast: true }
							);
						});
				}
			}
		},
		{
			command	: "yoru list citizens",
			desc	: "Lets Yoru provide you the list of all active citizens in your world.",
			regex	: /^list citizens/i,
			respond	: function(result) {
				
			}
		},
		{
			command	: "yoru inquire [name]",
			desc	: "Lets Yoru inquire about [name]'s status (online/offline).",
			regex	: /^inquire (.+)/i,
			respond	: function(result) {
			
			}
		},
		{
			command	: "yoru shout [message]",
			desc	: "Lets Yoru broadcast a [message] to all citizens without giving in your identity.",
			regex	: /^shout (.+)/i,
			respond	: function(result) {
				firebase.sendMessage(
					"I just picked up a crumpled note on the street saying: " + result[1], 
					{ asYoru: true }
				);
			}
		},
		{
			command	: "yoru clear",
			desc	: "Lets Yoru clear the screen for you.",
			regex	: /^clear/i,
			respond	: function(result) {
			
			}
		}
	];
}]);
