// YOUR CODE HERE:
$(document).ready(function () {
  var app = {};

  app.init = function () {
    this.handleUsernameClick();
    this.handleSubmit();
    
    var url = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.fetch(url, data => data.results.forEach(message => app.renderMessage(message)));
  };

  app.handleUsernameClick = function () {
    $('.username').on('click', function(){});
  };

  app.handleSubmit = function () {
    $('#send .submit').on('submit', function(event){
      console.log(event);
      // app.send(message);
    });
  };

  app.send = function (message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.fetch = function (url, callback) {
    $.get(url, callback);
    // $.ajax({
    //   // This is the url you should use to communicate with the parse API server.
    //   url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    //   type: 'GET',
    //   success: function () {
    //     console.log('chatterbox: Message received');
    //   },
    //   error: function () {
    //     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    //     console.error('chatterbox: Failed to receive message');
    //   }
    // });
  };

  app.clearMessages = function () {
    $('#chats').empty();
  };

  app.renderMessage = function (message) {
    var usernameDiv = $('<div>');
    usernameDiv.addClass('username');
    usernameDiv.text(`${message.username}:`);
    
    var text = $('<span>');
    text.text(`${message.text}`);
    
    var messageContainer = $('<div>');
    messageContainer.addClass('chat');
    messageContainer.append(usernameDiv);
    messageContainer.append(text);
    
    
    $('#chats').append(messageContainer);
  };

  app.renderRoom = function(lobbyName) {
    var lobbyDiv = $('<option>');
    lobbyDiv.text(lobbyName);
    $('#roomSelect').append(lobbyDiv);
  };

  app.init();
});
