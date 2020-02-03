const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cote = require('cote');
const customersUtility = require('./utility');


customersUtility.prepareTable();

app.use(bodyParser.json());
app.post('/customers', (req, res) => {
    console.log('#Step 01 : calling customers utility');
    console.log(req.body);
    customersUtility.queryCustomers(req.body, customersQueryResponse => {
        if (customersQueryResponse.error) res.status(500).json(customersQueryResponse.error);
        else res.status(200).json(customersQueryResponse);
    })
});



app.listen(5000, () => console.log('LISTENING ON SERVER 5000'));