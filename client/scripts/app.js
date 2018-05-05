// YOUR CODE HERE:
var app = {};
$(document).ready(function () {

  app.init = function () {
    this.fetch();
    this.handleSubmit();
    this.handleUsernameClick();
    $('.refresh').on('click', function () {
      app.fetch();
    });
    
    this._friends = {};
    this._rooms = {};
  };

  app.handleUsernameClick = function (event) {
    $('#chats').on('click', '.username', function(event) {
      var username = window.location.search.slice(10);
      var friend = $(this).text();
      
      if (!app._friends[username]) {
        app._friends[username] = {[friend]: true};
      } else if (!app._friends[username][friend]) {
        app._friends[username][friend] = true;
      } 
      app.fetch();
      
      console.log(app._friends[username][friend]);
    });
  };

  app.handleSubmit = function () {
    $('#send').submit(function(event) {
      var roomname = $('#roomSelect').find(':selected').text();
      var text = $('input[type = "text"]').val();
      var username = window.location.search.slice(10);
      app.send({
        username: username,
        text: text,
        roomname: roomname,
      }, () => {
        app.fetch();
      });
      event.preventDefault();   
    });
  };

  app.send = function (message, callback) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: callback,
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.fetch = function () {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      data: 'order=-createdAt',
      success: data => {
        console.log(data);
        app.clearMessages();
        data.results.forEach(message => {
          app.renderMessage(message);
        });
        $('#roomSelect').empty();
        for (var room in app._rooms) {
          app.renderRoom(room);
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.clearMessages = function () {
    $('#chats').empty();
  };

  app.renderMessage = function (message) {
    
    var loggedInUser = window.location.search.slice(10);
    
    
    var usernameDiv = $('<div>');
    usernameDiv.addClass('username');
    usernameDiv.text(`${message.username}`);
    
    var text = $('<div>');
    text.addClass('messageText');
    text.text(`${message.text}`);
    if (app._friends[loggedInUser] && app._friends[loggedInUser][message.username]) {
      text.addClass('bold');
      console.log('changed', app._friends[loggedInUser]);
    }
    
    var roomname = document.createElement('div');
    $(roomname).addClass('roomname');
    $(roomname).text(`room: ${message.roomname ? message.roomname : ''}`);
    if (!app._rooms[message.roomname]) {
      app._rooms[message.roomname] = true;
    }
    
    var date = $('<div>');
    var time = moment(message.createdAt).format('MMMM Do YYYY, h:mm:ss a');
    date.text(`${time}`);
    
    var messageContainer = $('<div>');
    messageContainer.addClass('chat');
    messageContainer.append(usernameDiv);
    messageContainer.append(roomname);
    messageContainer.append(text);
    messageContainer.append(date);
    
    $('#chats').append(messageContainer);
  };

  app.renderRoom = function(lobbyName) {
    var lobbyDiv = $('<option>');
    lobbyDiv.text(lobbyName);
    $('#roomSelect').append(lobbyDiv);
  };
  
  app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
  
  app.init();
});
