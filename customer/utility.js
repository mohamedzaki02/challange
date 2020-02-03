const cote = require('cote');
const keys = require('./keys');

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.CUSTOMER_PG_USER,
    host: keys.CUSTOMER_PG_HOST,
    database: keys.CUSTOMER_PG_DB,
    password: keys.CUSTOMER_PG_PASS,
    port: keys.CUSTOMER_PG_PORT
});

pgClient.on('error', () => console.log('Lost PG connection'))





// USING COTE : Customers Service is expected to REQUEST (connected|disconnected) Vehicles => From Vehicles Service
const vehicleRequester = new cote.Requester({ name: 'customers' });



//TESTING MICROSERVICES IN MULTI_DOCKER_CONTAINERS
vehicleRequester.send({ type: 'customer_vehicle_handshake' }, handshake_Response => {
    console.log('### Customers > Handshake Response : ' + handshake_Response + ' ###');
});



const filterVehicles = (status, cb) => {
    vehicleRequester.send({ type: 'filter_vehicles_status', status: status }, customerIds => {
        cb(customerIds);
    });
}




const utilityObj = {
    prepareTable: () => {
        pgClient
            .query("DROP TABLE IF EXISTS customers CASCADE")
            .then(() => {
                pgClient
                    .query("CREATE TABLE IF NOT EXISTS customers (customerId integer PRIMARY KEY,fullName varchar(45) UNIQUE NOT NULL,address varchar(450) NOT NULL)")
                    .then(() => {
                        pgClient.query("INSERT INTO customers (customerId, fullName, address) VALUES " +
                            "(123, 'mohamed zaki', 'new address')," +
                            "(124, 'momtaz ahmed', 'other value')," +
                            "(125, 'mark tomas', 'somewhere')"
                        )
                            .then(() => {
                                pgClient.query("SELECT * from customers")
                                    .then(allCustomers => {

                                        console.log('### ALL CUSTOMERS ###');
                                        console.log(allCustomers.rows);
                                        console.log('### ----------------------------------------------------------------------- ###');


                                        // pgClient.query("SELECT * from customers WHERE fullName LIKE 'mo%' ")
                                        //     .then(fewCustomers => {

                                        //         console.log('### LESS CUSTOMERS ###');
                                        //         console.log(fewCustomers.rows);
                                        //         console.log('### ----------------------------------------------------------------------- ###');


                                        //     })
                                        //     .catch(err => console.log(err));

                                    })
                                    .catch(err => console.log(err));
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    },
    getCustomers: (query, cb) => {
        pgClient
            .query(query)
            .then((customers) => {
                cb(customers.rows);
            })
            .catch(err => cb({ error: err }));
    },
    queryCustomers: (queryParams, cb) => {
        let query = 'SELECT * from customers',
            filterExpression = false,
            filterExpressionString = 'WHERE ';

        if (queryParams && (queryParams.customerId || queryParams.vehicleStatus)) {

            if (queryParams.customerId) {
                filterExpression = true;
                filterExpressionString += 'customerId=' + queryParams.customerId
            }

            if (queryParams.vehicleStatus) {
                filterVehicles(queryParams, customerIds => {

                    filterExpressionString += ((filterExpression ? ' AND ' : '') + 'customerId IN (' + customerIds.join(',') + ')');
                    let finalQuery = query + filterExpressionString;

                    utilityObj.getCustomers(finalQuery, customersResponse => {
                        if (customersResponse.error) cb({ error: customersResponse.error });
                        else cb(customersResponse);
                    });

                });
            }
            else {
                utilityObj.getCustomers(query + (filterExpression ? filterExpressionString : ''), customersResponse => {
                    if (customersResponse.error) cb({ error: customersResponse.error });
                    else cb(customersResponse);
                });
            }
        }
        else {
            utilityObj.getCustomers(query, customersResponse => {
                if (customersResponse.error) cb({ error: customersResponse.error });
                else cb(customersResponse);
            });
        }



    }

};

module.exports = utilityObj;