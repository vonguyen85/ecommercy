require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const cookiesParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()

app.use(express.json())
app.use(cookiesParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))

const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log('Connected to mongodb')
})

app.use('/user', require('./routes/userRoute'))
app.use('/api', require('./routes/categoryRoute'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRoute'))

app.get('/', (req, res) => {
    return res.json('welcome to me')
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`)
})