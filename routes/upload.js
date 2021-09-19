const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
})

router.post('/upload', auth, authAdmin, (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ message: 'No files were uploaded' })

        const file = req.files.file
        if (file.size > 1024 * 1024) //file size > 1Mb
        {
            removeTempFile(file.tempFilePath)
            return res.status(400).json({ message: 'Size too large' })
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTempFile(file.tempFilePath)
            return res.status(400).json({ message: 'File format is incorrect' })
        }

        //upload image to cloudinary, folder: test
        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: 'test' },
            async(error, result) => {
                if (error) throw error

                removeTempFile(file.tempFilePath)
                res.json({ public_id: result.public_id, url: result.secure_url })
            })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
})

// Delete image
router.post('/destroy', auth, authAdmin, (req, res) => {
    try {
        const { public_id } = req.body
        if (!public_id) return res.status(400).json({ message: 'No images selected' })

        cloudinary.v2.uploader.destroy(public_id, async(error, result) => {
            if (error) throw error

            return res.json({ message: 'Deleted Image' })
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
})

const removeTempFile = path => {
    fs.unlink(path, error => {
        if (error) throw error
    })
}

module.exports = router