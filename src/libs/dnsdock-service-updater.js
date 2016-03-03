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
    request(url, function (error, response) {
      var responseData = 'null';

      if (object.isValidResponse(response) && !error) {
        responseData = response.body;
      }

      if (responseData !== services) {
        services = responseData;
        object.emit('services-updated', JSON.parse(responseData));
      }
    });
  }

  object.stop = function() {
    clearInterval(interval);
    object.emit('stop');
  }

  object.isValidResponse = function(response) {
    if (response && (response.hasOwnProperty('statusCode') && response.statusCode === 200)
      && response.hasOwnProperty('body')
    ) {
      return true;
    }

    return false;
  }

  return object;
}

module.exports = new DNSDockServiceUpdater;