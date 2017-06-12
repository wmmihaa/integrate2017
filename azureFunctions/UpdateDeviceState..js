module.exports = function(context, msg) {
    
    var connectionString = process.env['iotHub'];
    
    var Registry = require('azure-iothub').Registry;
    var registry = Registry.fromConnectionString(connectionString);
    var maxTemp = 40;
    var minTemp = -20;

    registry.getTwin(msg.deviceId, function (err, twin) {
        
        if (err) {
            context.log(err.message);
            context.done();
            return;
        }
        
        var currentState = twin.properties.desired.thermostat.state;
        var twinPatch = { properties: twin.properties }

        twinPatch.properties.desired.thermostat.state = msg.thermostataction > 0 ? "On" : "Off";
        twinPatch.properties.desired.thermostat.temperature = msg.thermostataction > 0 ? maxTemp : minTemp;

        // Ignore if state has not changed
        if(currentState === twinPatch.properties.desired.thermostat.state){
            context.log('Ignore');
            context.done(); 
            return;
        }

        twin.update(twinPatch, function (err, twin) {
            if (err) {
                context.log(err.message);
            }
            else {
                context.log('Twin updated successfully');
            }
            context.done();
        });
    });
};