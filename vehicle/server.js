const express = require('express');
const app = express();


const vehicleUtility = require('./utility');
vehicleUtility.prepareTable();


app.post('/vehicles', (req, res) => {

    vehicleUtility.queryVehicles(req.body, (vehiclesResponse) => {
        if (vehiclesResponse.error) res.status(500).json(vehiclesResponse.error);
        else res.status(200).json(vehiclesResponse);
    });

});


app.listen(6000, () => console.log('LISTENING ON SERVER 6000'));