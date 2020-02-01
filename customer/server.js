const express = require('express');
const app = express();
const cote = require('cote');
const customersUtility = require('./utility');

// USING COTE : Customers Service is expected to REQUEST (connected|disconnected) Vehicles => From Vehicles Service
const vehicleRequester = new cote.Requester({ name: 'customers' });



//TESTING MICROSERVICES IN MULTI_DOCKER_CONTAINERS
vehicleRequester.send({ type: 'handshake' }, handshake_Response => {
    console.log('### Handshake Response : ' + handshake_Response + ' ###');
});



const filterVehicles = (status, cb) => {
    vehicleRequester.send({ type: 'filter_vehicles_status', status: status }, customerIds => {
        cb(customerIds);
    });
}

customersUtility.prepareTable();


app.post('/', (req, res) => {

    let query = 'SELECT * from customers',
        filterExpression = false,
        filterExpressionString = 'WHERE ';

    if (req.body.customerId) {
        filterExpression = true;
        filterExpressionString += 'customerId=' + req.body.customerId
    }

    if (req.body.vehcileStatus) {
        filterExpression = true;
        let status = req.body.vehcileStatus == 'connected' ? true : false;
        filterVehicles(status, customerIds => {
            filterExpressionString += ((req.body.customerId ? ' AND ' : '') +
                (status ? '' : 'NOT ') +
                'customerId IN (' + customerIds.join(',') + ')');
            let finalQuery = query + (filterExpression ? filterExpressionString : '');
            console.log(finalQuery);
            customersUtility.getCustomers(finalQuery, customersResponse => {
                if (customersResponse.error) res.status(500).json(customersUtility.error);
                else res.status(200).json(customersUtility);
            });
        });
    } else {
        customersUtility.getCustomers(query + (filterExpression ? filterExpressionString : ''), customersResponse => {
            if (customersResponse.error) res.status(500).json(customersUtility.error);
            else res.status(200).json(customersUtility);
        });
    }

});



app.listen(5000, () => console.log('LISTENING ON SERVER 5000'));