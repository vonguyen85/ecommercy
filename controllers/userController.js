const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = {
    //Register
    register: async(req, res) => {
        try {
            const {
                name,
                email,
                password
            } = req.body
            const user = await User.findOne({
                email
            })

            if (user) return res.status(400).json({
                message: 'The email is already exist'
            })
            if (password.length < 6)
                return res.status(400).json({
                    message: 'The password is at least 6 characters long.'
                })

            const passwordHash = await bcrypt.hash(password, 10)

            const newUser = new User({
                name,
                email,
                password: passwordHash
            })

            await newUser.save()

            const accessToken = createActionToken({
                id: newUser._id
            })
            const refreshToken = createRefreshToken({
                id: newUser._id
            })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })
            return res.json({
                accessToken
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },

    // Login
    login: async(req, res) => {
        try {
            const {
                email,
                password
            } = req.body
            const user = await User.findOne({
                email
            })
            if (!user) return res.status(400).json({
                message: 'The email does not exist'
            })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({
                message: 'Incorrect Password'
            })

            const accessToken = createActionToken({
                id: user._id
            })
            const refreshToken = createRefreshToken({
                id: user._id
            })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })
            return res.json({
                accessToken
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    // Log out
    logout: (req, res) => {
        try {
            res.clearCookie('refreshToken', {
                path: '/user/refresh_token'
            })
            return res.json({
                message: 'Logged out'
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken
            if (!rf_token) return res.status(400).json({
                message: 'Please Login or Register'
            })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({
                    message: 'Please Login or Register'
                })

                const accessToken = createActionToken({
                    id: user.id
                })

                res.json({
                    user,
                    accessToken
                })
            })
            res.json({
                rf_token
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }

    },
    getUser: async(req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password')
            if (!user) return res.status(400).json({
                message: 'User does not exist'
            })

            return res.json(user)
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}

const createActionToken = user => {
    return jwt.sign(user, process.env.ACTION_TOKEN_SECRET, {
        expiresIn: '1d'
    })
}

const createRefreshToken = user => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    })
}
module.exports = userController