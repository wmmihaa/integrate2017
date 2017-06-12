// Cloud -> Device
'use strict';

require('colors');

var settings = require('./lib/settings');
var EventHubClient = require('azure-event-hubs').Client;

var client = EventHubClient.fromConnectionString(settings.serviceConnectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return client.createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() }).then(function (receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', function (err) {
                    console.log("Error: ".red + err.message);
                });
                receiver.on('message', function (message) {
                    console.log('Message received:'.green);
                    console.log(JSON.stringify(message.body));
                    console.log('');
                });
            });
        });
    })
    .catch(function (err) {
        console.log("Error: ".red + err.message);
    });
