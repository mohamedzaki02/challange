const express = require('express');
const app = express();
const cote = require('cote');
const vehicleResponder = new cote.Responder({ name: 'vehicles' });


//TESTING MICROSERVICES IN MULTI_DOCKER_CONTAINERS
vehicleResponder.on('handshake', (req, cb) => {
    cb(new Date());
});


vehicleResponder.on('filter_vehicles_status', (req, cb) => {
    vehicleUtility.filterVehicleStatus(req.body.vehicleStatus, customerIds => {
        cb(customerIds)
    });
});

const vehicleUtility = require('./utility');
vehicleUtility.prepareTable();


app.post('/', (req, res) => {
    let query = 'SELECT * from vehicles',
        filterExpression = false,
        filterExpressionString = 'WHERE ';

    if (req.body.customerId) {
        filterExpression = true;
        filterExpressionString += 'customerId=' + req.body.customerId;
    }
    let finalQuery = query + (filterExpression ? filterExpressionString : '');
    console.log(finalQuery);
    vehicleUtility.getVehicles(finalQuery, (vehiclesResponse) => {
        if (vehiclesResponse.error) res.status(500).json(vehiclesResponse.error);
        else res.status(200).json(vehiclesResponse);
    });
});


app.listen(6000, () => console.log('LISTENING ON SERVER 6000'));