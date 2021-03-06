'use strict';

const Homey = require('homey');

class VirtualDriver extends Homey.Driver {
  onInit() {
		this.log('Initialized driver for Virtual Devices');

    this.registerFlowCardAction('set_sensor_value', false);
	}

  onPair( socket ) {

    socket.on('log', function( msg, callback ) {
        console.log(msg);
        callback( null, "ok" );
    });

    socket.on('getIcons', function( data, callback ) {
        console.log("Adding new device");

        var device_data = [
	        getIconNameAndLocation('switch'),
	        getIconNameAndLocation('light'),
	        getIconNameAndLocation('blinds'),
          getIconNameAndLocation('curtains'),
	        getIconNameAndLocation('tv'),
	        getIconNameAndLocation('hifi'),
	        getIconNameAndLocation('alarm'),
          getIconNameAndLocation('radiator'),
          getIconNameAndLocation('thermostat'),
          getIconNameAndLocation('sensor'),
          getIconNameAndLocation('button'),
          getIconNameAndLocation('lock'),
	    ]

        callback( null, device_data );
    });

    socket.on('disconnect', function(){
        console.log("User aborted pairing, or pairing is finished");
    })
  }

  registerFlowCardAction(card_name) {
    let flowCardAction = new Homey.FlowCardAction(card_name);
    flowCardAction
      .register()
      .registerRunListener(( args, state ) => {
        let device = args.device;
        if (typeof(device) == 'undefined' || device == null ) {
          this.log('Action triggered without device: ' + simpleStringify(args) );
          return Promise.reject(new Error('device is null or undefined'));
        }

//        this.log(device.getName() + ' -> Sensor: ' + args.sensor);
//        this.log(device.getName() + ' -> Value:  ' + parseFloat(args.value, 10));

        device.setCapabilityValue(args.sensor, parseFloat(args.value, 10)) // Fire and forget
           .catch(this.error);

        return Promise.resolve( true );
      })
  }
}

module.exports = VirtualDriver;

function getIconNameAndLocation( name ) {
	return {
		"name": name,
		"location": "../assets/" + name + ".svg"
	}
};

function cleanJson (object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return simpleObject; // returns cleaned up Object
};

function simpleStringify (object) {
    var simpleObject = cleanJson(object);
    return JSON.stringify(simpleObject);
};
