const express = require('express')
const app = express()
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express')

const swaggerDocument = require('./swagger.json')

// config env
require('dotenv').config()

// Settings
app.set('port', process.env.PORT || 3001)

// Middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Routes
app.use('/v1/api/files', require('./src/routes/v1'))

app.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
)

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`)
}
)
