'use strict';

yoruApp.factory('yoru', ['commands', 'firebase', function(commands, firebase) {
  var yoruCommands = commands;

  // Public API here
  return {
	/*
		feed function receives the message from the controller.
		It parses the message to determine if it is a command or not.
		If it's a command, then iterate through all the yoru commands
		and if there is a match, then respond accordingly.
		If it's not a command, then simply broadcast the message.
	*/
    feed: function(message) {
		var command = $.trim(message).match(/^yoru (.+)/i);
		if (command && command[1]) {
			$.each(yoruCommands, function(){
				var result = command[1].match(this.regex);
				if (result) {
					this.respond(result);
					return false;
				}
			});
		}
		else {
			firebase.sendMessage(message);
		}
	},
	/*
		listen function simply attaches/deattaches callback functions to
		an event when client has received a message response.
		The response message is passed to the callback as the 2nd parameter.
	*/
	listen: function(callback) {
		if (callback) {
			$.subscribe('yoru:response', callback);
		}
		else {
			$.unsubscribe('yoru:response');
		}
	}
  };
}]);
