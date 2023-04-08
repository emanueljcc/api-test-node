const { Router } = require('express')
const router = Router()
const _ = require('lodash')
const { headers } = require('../../config/headers')
const getFiles = require('../../helper')
const HttpStatusCode = require('../../config/HttpStatusCode')

// csv libraries required
const request = require('request')
const csv = require('csvtojson')

// envs
const API_URL = process.env.API_URL

// TODO: agregar README detallado en back y front
// TODO: crear carpeta controllers
router.get('/data', async (req, res) => {
  try {
    const { fileName } = req.query

    const files = await getFiles()

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

    res
      .status(HttpStatusCode.OK)
      .json({
        message: 'File list fetched successfully',
        data: _.isEmpty(fileName) ? result : findByFileName || []
      })
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER)
      .json({
        message: 'An unexpected error has occurred',
        detail: error.message
      })
  }
})

router.get('/list', async (req, res) => {
  try {
    const files = await getFiles()

    res
      .status(HttpStatusCode.OK)
      .json({
        message: 'File list fetched successfully',
        data: files
      })
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER)
      .json({
        message: 'An unexpected error has occurred',
        detail: error.message
      })
  }
})

module.exports = router
