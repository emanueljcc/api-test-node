const fetch = require('node-fetch')
const _ = require('lodash')

const headers = require('../config/headers')

// csv libraries required
const request = require('request')
const csv = require('csvtojson')

// envs
const API_URL = process.env.API_URL

const getAllFilesList = async () => {
  try {
    const getFiles = await fetch(`${API_URL}/v1/secret/files`, headers)
    const data = await getFiles.json()
    const files = data.files

    return files
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * This function retrieves CSV files and returns either all files or a specific file based on the
 * provided file name.
 * @param [fileName] - The parameter `fileName` is a string that represents the name of a CSV file.
 * @returns the function will either return an empty array or an empty object depending
 * on whether `fileName` is empty or not.
 */
const getCsvFiles = async (fileName = '') => {
  try {
    const files = await getAllFilesList()

    const urlLists = files.map((file) => `${API_URL}/v1/secret/file/${file}`)

    // loop
    const list = await urlLists.map(async (url) => {
      const arrData = await csv().fromStream(request.get(url, headers))
      const groupArr = arrData.map(arr => arr)

      const groupByFileName = _(groupArr)
        .groupBy(g => g.file)
        .map((value, key) => {
          const lines = value.map(({
            text = '',
            number = '',
            hex = ''
          }) => ({
            text,
            number,
            hex
          }))

          return {
            file: key,
            lines
          }
        })
        .value()
        .find(r => r)

      return groupByFileName
    })

    const promiseAll = await Promise.all(list)
    const result = promiseAll.filter(r => r)
    const findByFileName = result.find(r => r.file === fileName)

    return _.isEmpty(fileName) ? result : [findByFileName] || []
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = { getAllFilesList, getCsvFiles }
