// Device -> Cloud
'use strict';

require('colors');

var settings = require('./lib/settings');
var Thermometer = require('iot-simlators').Thermometer;
var thermometer = new Thermometer();

var Protocol = require('azure-iot-device-mqtt').Mqtt;
//var Protocol = require('azure-iot-device-amqp').Amqp;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

var client = Client.fromConnectionString(settings.deviceConnectionString, Protocol);

client.open(function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    }
    else {
        console.log('Client connected');

        //Create a message and send it to the IoT Hub every other second
        thermometer.start(1000, function (reading) {
            var json = JSON.stringify(reading);
            var message = new Message(json);
            console.log("Sending event: ".green + "Temerature: ".grey + reading.temperature);
            client.sendEvent(message, function (err) {
                if (err) {
                    console.log("Unable to send message. Error:".red + err);
                }
            });
        });
        client.on('error', function (err) {
            console.error(err.message.red);
        });
        
    }
});