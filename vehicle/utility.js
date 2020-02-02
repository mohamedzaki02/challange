const keys = require('./keys');

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.VEHICLE_PG_USER,
    host: keys.VEHICLE_PG_HOST,
    database: keys.VEHICLE_PG_DB,
    password: keys.VEHICLE_PG_PASS,
    port: keys.VEHICLE_PG_PORT
});

pgClient.on('error', () => console.log('Lost PG connection'));


const cote = require('cote');

// vehicles service should reply back to customers service 
// VEHICLES >> REPLY >> CUSTOMERS
const vehicleResponder = new cote.Responder({ name: 'vehicles_responder' });

// USING COTE : Vehicles Service is expected to REQUEST (only connected) Vehicles => From Monitor Service
// VEHICLES >> REQUEST >> Monitor
const vehicleStatusRequester = new cote.Requester({ name: 'vehicles' });


//TESTING MICROSERVICES IN MULTI_DOCKER_CONTAINERS
// vehicles send reply to customers
vehicleResponder.on('customer_vehicle_handshake', (req, cb) => {
    cb(new Date());
});


vehicleResponder.on('filter_vehicles', (req, cb) => {
    vehicleUtility.queryVehicles(req, vehicles => cb(vehicles))
});


//TESTING MICROSERVICES IN MULTI_DOCKER_CONTAINERS
// vehicles send request to monitor service
vehicleStatusRequester.send({ type: 'vehicle_monitor_handshake' }, handshake_Response => {
    console.log('### Vehicles > Handshake Response : ' + handshake_Response + ' ###');
});



const monitorVehicles = (cb) => {
    // vehicles requests only connected vehicles from monitor service
    vehicleStatusRequester.send({ type: 'filter_vehicles_status' }, connectedVehcilesIds => {
        cb(connectedVehcilesIds);
    });
}


const vehicleUtility = {
    prepareTable: () => {
        pgClient
            .query("DROP TABLE IF EXISTS vehicles CASCADE")
            .then(() => {
                pgClient
                    .query("CREATE TABLE IF NOT EXISTS vehicles (vehicleId integer PRIMARY KEY,customerId integer NOT NULL,registerNo varchar(45) UNIQUE NOT NULL)")
                    .then(() => {
                        pgClient.query("INSERT INTO vehicles (vehicleId, customerId, registerNo) VALUES " +
                            "(11, 123, 'asd-123')," +
                            "(12, 123, 'dxb-527')," +
                            "(13, 124, 'qwe-331')," +
                            "(14, 124, 'wer-455')," +
                            "(15, 124, 'rty-776')," +
                            "(16, 124, 'khj-654')," +
                            "(17, 125, 'hfg-227')"
                        )
                            .then(() => {
                                pgClient.query("SELECT * from vehicles")
                                    .then(allVehicles => {

                                        console.log('### ALL vehicles ###');
                                        console.log(allVehicles.rows);
                                        console.log('### ----------------------------------------------------------------------- ###');

                                    })
                                    .catch(err => console.log(err));
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    },
    getVehicles: (query, cb) => {
        console.log('#QUERY >>' + query);
        pgClient
            .query(query)
            .then((vehicles) => {
                cb(vehicles.rows);
            })
            .catch(err => cb({ error: err }));
    },
    queryVehicles: (queryParams, cb) => {
        let query = 'SELECT * from vehicles',
            filterExpression = false,
            filterExpressionString = 'WHERE ';

        if (req.body.customerId) {
            filterExpression = true;
            filterExpressionString += 'customerId=' + queryParams.customerId;
        }
        else if (req.body.customerIds) {
            filterExpression = true;
            filterExpressionString += 'customerId= IN (' + queryParams.customerIds.join(',') + ')';
        }

        if (req.body.vehcileStatus) {
            let status = queryParams.vehcileStatus == 'connected' ? true : false;

            monitorVehicles(status, connectedVehcilesIds => {

                filterExpressionString += ((filterExpression ? ' AND ' : '') + (status ? '' : 'NOT ') + 'vehicleId IN (' + connectedVehcilesIds.join(',') + ')');
                let finalQuery = query + filterExpressionString;
                console.log(finalQuery);

                getVehicles(finalQuery, customersResponse => {
                    if (customersResponse.error) cb({ error: customersResponse.error });
                    else cb(customersResponse);
                });
            });

        } else {
            getVehicles(query + (filterExpression ? filterExpressionString : ''), customersResponse => {
                if (customersResponse.error) cb({ error: customersResponse.error });
                else cb(customersResponse);
            });
        }
    }
};

module.exports = vehicleUtility;