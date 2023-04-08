const { Router } = require('express')
const router = Router()
const _ = require('lodash')

const HttpStatusCode = require('../../config/HttpStatusCode')

// file controller
const { getCsvFiles, getAllFilesList } = require('../../controllers/FilesController')

router.get('/data', async (req, res) => {
  try {
    const { fileName } = req.query

		const data = await getCsvFiles(fileName);

    res
      .status(HttpStatusCode.OK)
      .json({
        message: 'File list fetched successfully',
        data
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
    const data = await getAllFilesList()

    res
      .status(HttpStatusCode.OK)
      .json({
        message: 'File list fetched successfully',
        data
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
