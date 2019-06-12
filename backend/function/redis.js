const redis = require('redis');
const config = require("../config/config.json");
module.exports = redis.createClient(config.redis.port, config.redis.host);