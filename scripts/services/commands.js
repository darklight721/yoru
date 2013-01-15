'use strict';

yoruApp.factory('commands', ['firebase', function(firebase) {

	// Public API here
	return [
		{
			command	: "yoru create world",
			desc	: "Lets Yoru create a world for you.",
			regex	: /^create world/i,
			respond	: function(result) {
				firebase.createRoom();
			}
		},
		{
			command	: "yoru join world [id]",
			desc	: "Lets Yoru join you to a world identified by [id].",
			regex	: /^join world (.+)/i,
			respond	: function(result) {
				firebase.joinRoom(result[1]);
			}
		},
		{
			command	: "yoru leave world",
			desc	: "Lets Yoru remove you from the world you're in.",
			regex	: /^leave world/i,
			respond	: function(result) {
			
			}
		},
		{
			command	: "yoru locate world",
			desc	: "Lets Yoru provide you the URL of your world.",
			regex	: /^locate world/i,
			respond	: function(result) {
			
			}
		},
		{
			command	: "yoru identify [name]",
			desc	: "Lets Yoru give you a name specified by [name].",
			regex	: /^identify (.+)/i,
			respond	: function(result) {
			
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
