require('dotenv').config()

require('./server/backend')(process.env.BACKEND_PORT);
require('./server/middleware')(process.env.MIDDLEWARE_PORT);
