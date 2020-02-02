const express = require('express');
const app = express();
const cote = require('cote');
const customersUtility = require('./utility');


customersUtility.prepareTable();


app.post('/customers', (req, res) => {
    customersUtility.queryCustomers(req.body, customersQueryResponse => {
        console.log(customersQueryResponse);
        if (customersQueryResponse.error) res.status(500).json(customersQueryResponse.error);
        else express.status(200).json(customersQueryResponse);
    })
});



app.listen(5000, () => console.log('LISTENING ON SERVER 5000'));