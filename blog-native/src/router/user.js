
const { login } = require('../controller/user')
const { set } = require('../db/redis')
const { SuccessModel, ErrorModel } = require('../module/resModel')

// 获取cookie的过期时间
// const getCookieExpires = () => {
//     const d = new Date()
//     d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
//     return d.toUTCString()
// }

const handleUserRouter = (req, res) => {

    const method = req.method
    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {

        const { username, password } = req.body //POST时使用
        //const { username, password } = req.query  //GET时使用
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // 操作cookie, 此处不加单引号
                // res.setHeader('Set-Cookie', 
                // `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`)

                // 设置 session
                req.session.username = data.username
                req.session.realname = data.realname
                // console.log('req.session is: ', req.session)
                // 同步到 redis
                set(req.sessionId, req.session)

                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        })
    }

    // 登录验证的测试
    // if (method === 'GET' && req.path === '/api/user/login-test') {
    //     if (req.session.username) {
    //         return Promise.resolve(

    //             new SuccessModel({
    //                 session: req.session
    //             })
    //         )
    //     }
    //     return Promise.resolve(
    //         new ErrorModel('尚未登录')
    //     )
    // }

};

module.exports = handleUserRouter
