'use strict';


var Thermometer = require('iot-simlators').Thermometer;
var thermometer = new Thermometer();

thermometer.start(1000, function (reading) {

    console.log("Temerature: " + reading.temperature);

});