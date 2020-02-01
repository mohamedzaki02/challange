const keys = require('./keys');

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.VEHICLE_PG_USER,
    host: keys.VEHICLE_PG_HOST,
    database: keys.VEHICLE_PG_DB,
    password: keys.VEHICLE_PG_PASS,
    port: keys.VEHICLE_PG_PORT
});

pgClient.on('error', () => console.log('Lost PG connection'))

module.exports = {
    prepareTable: () => {
        pgClient
            .query("DROP TABLE IF EXISTS vehicles CASCADE")
            .then(() => {
                pgClient
                    .query("CREATE TABLE IF NOT EXISTS vehicles (vehicleId integer PRIMARY KEY,customerId integer NOT NULL,registerNo varchar(45) UNIQUE NOT NULL,vehicleStatus boolean DEFAULT FALSE)")
                    .then(() => {
                        pgClient.query("INSERT INTO vehicles (vehicleId, customerId, registerNo, vehicleStatus) VALUES " +
                            "(11, 123, 'asd-123', true)," +
                            "(12, 123, 'dxb-527', true)" +
                            "(13, 124, 'qwe-331', true)" +
                            "(14, 124, 'wer-455', true)" +
                            "(15, 124, 'rty-776', true)" +
                            "(16, 124, 'khj-654', true)" +
                            "(17, 125, 'hfg-227', true)"
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
        pgClient
            .query(query)
            .then((vehicles) => {
                cb(vehicles.rows);
            })
            .catch(err => cb({ error: err }));
    },
    filterVehicleStatus: (status, cb) => {
        pgClient
            .query('SELECT * from vehicles WHERE vehcicleStatus=' + status)
            .then((vehicles) => {
                cb(vehicles.rows.map(v => v.customerId));
            })
            .catch(err => {
                console.log(err);
                cb([]);
            });
    }
};