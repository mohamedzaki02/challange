const express = require('express');
const app = express();
const cote = require('cote');
const customersUtility = require('./utility');

// USING COTE : Customers Service is expected to REQUEST (connected|disconnected) Vehicles => From Vehicles Service
const vehicleRequester = new cote.Requester({ name: 'customers' });

const filterVehicles = (status, cb) => {
    vehicleRequester.send({ type: 'filter_vehicles_status', status: status }, (customerIds) => {
        cb(customerIds);
    });
}

customersUtility.prepareTable();


app.post('/', (req, res) => {
    const getCustomers = query => {
        pgClient
            .query(query)
            .then((customers) => {
                res.status(200).json(customers.rows);
            })
            .catch(err => res.status(500).json(err));
    }

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
            getCustomers(query + (filterExpression ? filterExpressionString : ''));
        })
            .catch(err => res.status(500).json(err));
    } else {
        getCustomers(query + (filterExpression ? filterExpressionString : ''));
    }

});



app.listen(5000, () => console.log('LISTENING ON SERVER 5000'));