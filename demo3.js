
require('colors');
var settings = require('./lib/settings');
var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

var client = Client.fromConnectionString(settings.serviceConnectionString);
var targetDevice = 'DEVICE1';

var methodParams = {
    methodName: 'getTemperature',
    payload: '',
    responseTimeoutInSeconds: 15 // set response timeout as 15 seconds 
};

client.invokeDeviceMethod(targetDevice, methodParams, function (err, result) {
    if (err) {
        console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
    } else {
        console.log(methodParams.methodName + ' on ' + targetDevice + ':');
        console.log(JSON.stringify(result, null, 2).grey);
    }
});