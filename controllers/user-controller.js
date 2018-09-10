exports.createUser = (req, res, next) => {
    res.status(201).json({
        message: 'created'
    })
}

exports.loginUser = (req, res, next) => {
    res.status(201).json({
        message: 'login'
    })
}

exports.getUser = (req, res, next) => {
    res.status(201).json({
        message: 'get user'
    })
}

exports.getCartInfo = (req, res, next) => {
    res.status(201).json({
        message: 'get cart'
    })
}