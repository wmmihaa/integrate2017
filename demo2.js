// Device -> Cloud

'use strict';

require('colors');

var settings = require('./lib/settings')
var Thermometer = require('iot-simlators').Thermometer;
var Thermostat = require('iot-simlators').Thermostat;
var thermostat = new Thermostat();
var thermometer = new Thermometer(thermostat);

var Protocol = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

var client = Client.fromConnectionString(settings.deviceConnectionString, Protocol);

client.open(function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    }
    else {
        console.log('Client connected');

        client.getTwin(function (err, twin) {
            if (err) {
                console.error('Could not get twin'.red);
            }
            else {
                console.log("Device twin is ready".green);
                twin.on('properties.desired', function (desiredState) {

                    console.log("Received desired state : ".green + JSON.stringify(desiredState));
                    thermostat.setTemperature(desiredState.thermostat.temperature);
                    if (desiredState.thermostat.state === 'On')
                        thermostat.switchOn();
                    else
                        thermostat.switchOff();
                });
            }
        });

        thermometer.start(1000, function (reading) {
            
            reading.deviceId = settings.deviceId;
            var json = JSON.stringify(reading);
            console.log("Sending event: ".green + "Temerature: ".grey + reading.temperature);
            var message = new Message(json);
            client.sendEvent(message, function(err){
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