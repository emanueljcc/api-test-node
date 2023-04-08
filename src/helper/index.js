const fetch = require('node-fetch')

const headers = require('../config/headers')

// envs
const API_URL = process.env.API_URL

const getFiles = async () => {
  try {
    const getFiles = await fetch(`${API_URL}/v1/secret/files`, headers)
    const data = await getFiles.json()
    const files = data.files

    return files
  } catch (error) {
    console.log(error)
  }
}

module.exports = getFiles
