const API_KEY = process.env.API_KEY

module.exports = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}
