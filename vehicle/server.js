const express = require('express');
const app = express();
const cote = require('cote');
const vehicleResponder = new cote.Responder({ name: 'vehicles' });


//TESTING MICROSERVICES IN MULTI_DOCKER_CONTAINERS
vehicleResponder.on('handshake', (req, cb) => {
    cb(new Date());
});

const vehicleUtility = require('./utility');
vehicleUtility.prepareTable();


app.get('/:customerId', (req, res) => {
    vehicleUtility.getVehicles(req.params.customerId, (vehiclesResponse) => {
        if (vehiclesResponse.error) res.status(500).json(vehiclesResponse.error);
        else res.status(200).json(vehiclesResponse);
    });
});


app.listen(6000, () => console.log('LISTENING ON SERVER 6000'));