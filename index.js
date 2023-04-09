const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const swaggerDocument = require('./swagger.json');

// config env
require('dotenv').config();

const v1Router = require('./src/routes/v1');

const app = express();

app.use(cors({origin: '*'}));

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.use('/v1/api/files', v1Router);
// configure swagger
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3001;

// Starting the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

module.exports = app;
