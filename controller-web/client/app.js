/*global URL,config*/

/* dependencies */
var $ = require('jquery');
var io = require('socket.io-client');
var blobToImage = require('./blob');

// resize asap before loading other stuff
function resize(){
  if ($(window).width() <= 500) {
    $('#chat, #game').css('height', $(window).height() / 2);
    $('.input input').css('width', $(window).width() - 40);
    $('.messages').css('height', $(window).height() / 2 - 70);
  } else {
    $('#chat, #game').css('height', $(window).height());
    $('.input input').css('width', $('.input').width());
    $('.messages').css('height', $('#chat').height() - 70);
  }
  scrollMessages();
}
$(window).resize(resize);
resize();

// reset game img size for mobile now that we loaded
$('#game img').css('height', '100%');

var socket = io(config.io);
socket.on('connect', function(){
  $('body').addClass('ready');
  $('.messages').empty();
  $('.messages').removeClass('connecting');
  $('.messages').addClass('connected');
  $('.input').removeClass('connecting');
  $('.input').addClass('connected');
  $('.input form input').attr('placeholder', 'enter your name to play');
  $('.input form input').attr('disabled', false);
  message('Connected!');
  if (window.localStorage && localStorage.nick) {
    join(localStorage.nick);
  }
});

socket.on('disconnect', function(){
  message('Disconnected. Reconnecting.');
});

if ('ontouchstart' in window) {
  $('body').addClass('touch');
}

var joined = false;
var input = $('.input input');
var nick;
$('.input form').submit(function(ev){
  ev.preventDefault();
  var data = input.val();
  if ('' === data) return;
  input.val('');
  if (joined) {
    message(data, nick);
    socket.emit('message', data);
  } else {
    join(data);
  }
});

function join(data){
  nick = data;
  // Try-catch necessary because Safari might have locked setItem causing
  // exception
  try {
    if (window.localStorage) localStorage.nick = data;
  } catch (e) {}
  socket.emit('join', data);
  $('body').addClass('joined');
  $('.input').addClass('joined');
  input
  .attr('placeholder', 'type in to chat')
  .blur();
  joined = true;
}

input.focus(function(){
  $('body').addClass('input_focus');
});

input.blur(function(){
  $('body').removeClass('input_focus');
});

socket.on('joined', function(){
  $('.messages').append(
    $('<p>').text('You have joined.').append($('<span class="key-info"> Keys are as follows: </span>'))
    .append(
    $('<table class="keys">').append(
      $('<tr><td>left</td><td>←</td>'),
      $('<tr><td>right</td><td>→</td>'),
      $('<tr><td>up</td><td>↑</td>'),
      $('<tr><td>down</td><td>↓</td>'),
      $('<tr><td>Yaw Left</td><td>a</td>'),
      $('<tr><td>Yaw Right</td><td>s</td>'),
      $('<tr><td>Hover</td><td>d</td>'),
      $('<tr><td>Calibrate</td><td>o</td>'),
      $('<tr><td>Start Up</td><td>enter</td>'),
      $('<tr><td>Throttle 0-9</td><td>0-9</td>'),
      $('<tr><td>stop</td><td>b</td>')
    ))
    .append('<br><span class="key-info">Make sure the chat input is not focused to perform moves.</span><br> '
      + 'Lets start flying!')
  );

  $('table.unjoined').removeClass('unjoined');
  scrollMessages();
});

var map = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',
  65: 'yawleft',
  83: 'yawright',
  68: 'hover',
  66: 'stop',
  79: 'calibrate',
  13: 'startup',
  48: 't0',
  49: 't1',
  50: 't2',
  51: 't3',
  52: 't4',
  53: 't5',
  54: 't6',
  55: 't7',
  56: 't8',
  57: 't9',
};

var reverseMap = {};
for (var i in map) reverseMap[map[i]] = i;

$(document).on('keydown', function(ev){
  if (null == nick) return;
  var code = ev.keyCode;
  if ($('body').hasClass('input_focus')) return;
  if (map[code]) {
    ev.preventDefault();
    socket.emit('move', map[code]);
  }
});

// Listener to fire up keyboard events on mobile devices for control overlay
$('table.screen-keys td').mousedown(function() {
  var id = $(this).attr('id');
  var code = reverseMap[id];
  var e = $.Event('keydown');
  e.keyCode = code;
  $(document).trigger(e);

  $(this).addClass('pressed');
  var self = this;
  setTimeout(function() {
    $(self).removeClass('pressed');
  }, 1000);
});

socket.on('connections', function(total){
  $('.count').text(total);
});

socket.on('join', function(nick, loc){
  var p = $('<p>');
  p.append($('<span class="join-by">').text(nick));
  if (loc) {
    p.append(' (' + loc + ')');
  }
  p.append(' joined.');
  $('.messages').append(p);
  trimMessages();
  scrollMessages();
});

socket.on('move', function(move, by){
  var p = $('<p class="move">').text(' pressed ' + move);
  p.prepend($('<span class="move-by">').text(by));
  $('.messages').append(p);
  trimMessages();
  scrollMessages();
});

socket.on('message', function(msg, by){
  message(msg, by);
});

socket.on('reload', function(){
  setTimeout(function(){
    location.reload();
  }, Math.floor(Math.random() * 10000) + 5000);
});

function message(msg, by){
  var p = $('<p>').text(msg);
  if (by) {
    p.prepend($('<span class="message-by">').text(by + ': '));
  } else {
    p.addClass('server');
  }
  $('.messages').append(p);
  trimMessages();
  scrollMessages();
}

function trimMessages(){
  var messages = $('.messages');
  while (messages.children().length > 300) {
    $(messages.children()[0]).remove();
  }
}

function scrollMessages(){
  $('.messages')[0].scrollTop = 10000000;
}

var image = $('#game img')[0];
var lastImage;
socket.on('frame', function(data){
  if (lastImage && 'undefined' != typeof URL) {
    URL.revokeObjectURL(lastImage);
  }
  image.src = blobToImage(data);
  lastImage = image.src;
});

// Highlights controls when image or button pressed
function highlightControls() {
  $('table.screen-keys td:not(.empty-cell)').addClass('highlight');

  setTimeout(function() {
    $('table.screen-keys td').removeClass('highlight');
  }, 300);
}

$('img').mousedown(highlightControls);
$('table.screen-keys td').mousedown(highlightControls);
