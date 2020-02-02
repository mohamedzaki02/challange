const cote = require('cote');
const AWS = require('aws-sdk');
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
});
const keys = require('./keys');


//protocol://service-code.region-code.amazonaws.com
const ep = new AWS.Endpoint('http://dynamodb.' + keys.region + '.amazonaws.com');

AWS.config.update({
    region: keys.region,
    endpoint: ep,
    accessKeyId: keys.dynamo_user_access_key,
    secretAccessKey: keys.dynamo_user_secret_access_key
});

const docClient = new AWS.DynamoDB.DocumentClient();

const monitorResponder = new cote.Responder({ name: 'monitor_responder' });

//TESTING MICROSERVICES IN MULTI_DOCKER_CONTAINERS
// monitor send reply to vehicles
monitorResponder.on('vehicle_monitor_handshake', (req, cb) => {
    cb(new Date());
});




const sub = redisClient.duplicate();


sub.on('connect', () => console.log('### Monitor >> connecting to redis ###'));


sub.on('err', err => console.log(err));


sub.on('message', (channel, message) => {
    var currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 1);
    var params = {
        TableName: keys.dynamo_table,
        Item: {
            vehicleId: Number(message),
            expiryDate: Math.round(currentDate.getTime() / 1000)
        }
    };

    console.log("Adding a new item...");
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
});
sub.subscribe('insert');





monitorResponder.on('filter_vehicles_status', (req, cb) => {

    const params = {
        TableName: keys.dynamo_table
    };

    // usually I avoid using scans and if i have too; i do small parallel scans
    // in our scenario here rows have a TTL period of one minute after that it will be marked { expired } and gets deleted in 48 hours.
    docClient.scan(params, function (err, result) {
        if (err) {
            cb({ error: err });
        } else {
            cb(result);
        }
    });
});




