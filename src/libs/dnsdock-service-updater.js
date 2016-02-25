var events = require('events');

function DNSDockServiceUpdater() {
  var interval = null,
    intervalDelay = 1000,
    request = require('request'),
    assert = require('assert'),
    url = 'http://dnsdock.docker/services',
    services = {};

  var object = new events.EventEmitter;

  object.start = function() {
    interval = setInterval(object.update, intervalDelay);
    object.emit('start');
  }

  object.update = function() {
    request(url, function (error, response, body) {
      if (response.statusCode !== 200 || error) {
        object.emit('error', error);
        return;
      }

      if (body !== services) {
        object.emit('services-updated', JSON.parse(body));
        services = body;
      }
    });
  }

  object.stop = function() {
    clearInterval(interval);
    object.emit('stop');
  }

  return object;
}

module.exports = new DNSDockServiceUpdater;