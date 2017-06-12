module.exports = function (context, msg) {

  var Client = require('azure-iothub').Client;
  var Message = require('azure-iot-common').Message;

  var connectionString = process.env['iotHub'];
  var targetDevice = 'DEVICE1';
  var client = Client.fromConnectionString(connectionString);

  client.open(function (err) {
    if (err) {
      context.log.error('Could not connect: ' + err.message);
    }
    else {
      context.log('Client connected');

      var message = new Message(JSON.stringify(msg));
      context.log('Sending message: ' + message.getData());

      client.send(targetDevice, message, function (err) {
        if (err)
          context.log.error('Could not send command: ' + err.message);
        else
          context.log('Command sent');

        context.done();
      });

    }
  });
};