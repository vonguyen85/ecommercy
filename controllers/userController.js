const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = {
    register: async(req, res) => {
        try {
            const { name, email, password } = req.body
            const user = await User.findOne({ email })

            if (user) return res.status(400).json({ message: 'The email is already exist' })
            if (password.length < 6)
                return res.status(400).json({ message: 'The password is at least 6 characters long.' })

            const passwordHash = await bcrypt.hash(password, 10)

            const newUser = new User({
                name,
                email,
                password: passwordHash
            })

            await newUser.save()

            const accessToken = createActionToken({ id: newUser._id })
            const refreshToken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })
            return res.json({ accessToken })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken
            if (!rf_token) return res.status(400).json({ message: 'Please Login or Register' })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ message: 'Please Login or Register' })

                const accessToken = createActionToken({ id: user.id })

                res.json({ user, accessToken })
            })
            res.json({ rf_token })
        } catch (error) {

        }

    }
}

const createActionToken = user => {
    return jwt.sign(user, process.env.ACTION_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = user => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
module.exports = userController