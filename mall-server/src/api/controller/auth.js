const Base = require('./base.js');

module.exports = class extends Base {
    async registerAction() {
        const mobile = this.post('mobile');
        const password = this.post('password');
        const password_salt = this.getTime();
        const newUser = {
            username: mobile,
            mobile: mobile,
            password_salt: password_salt,
            password: think.md5(password + '' + password_salt),
            register_time: parseInt(new Date().getTime() / 1000),
            register_ip: this.ctx.ip,
            last_login_time: this.getTime(),
            last_login_ip: this.ctx.ip,
        };
        const result = await this.model('user').add(newUser).catch(err => {
            return think.isError(err) ? err : new Error(err)
        });;
        if (think.isError(result)) {
            return this.fail(401, '该用户已存在');
        }

        const user = await this.model('user').where({
            mobile: mobile
        }).find();
        const userInfo = {
            user_id: user.id,
            user_name: user.username,
            avatar: user.avatar,
            gender: user.gender
        };

        const TokenService = this.service('token', 'api');
        const token = await TokenService.create(userInfo);
        return this.success({
            token: token,
        });

    }
    async loginAction() {
        const mobile = this.post('mobile');
        const password = this.post('password');
        const user = await this.model('user').where({
            mobile: mobile
        }).find();
        if (think.isEmpty(user)) {
            return this.fail(401, '用户名不存在');
        }

        if (think.md5(password + '' + user.password_salt) !== user.password) {
            return this.fail(401, '密码不正确');
        }

        // 更新登录信息
        await this.model('user').where({
            id: user.id
        }).update({
            last_login_time: this.getTime(),
            last_login_ip: this.ctx.ip
        });

        const userInfo = {
            user_id: user.id,
            user_name: user.username,
            avatar: user.avatar,
            gender: user.gender
        };

        const TokenService = this.service('token', 'api');
        const token = await TokenService.create(userInfo);

        return this.success({
            token: token,
        });
    }
    async loginByWeixinAction() {
        const code = this.post('code');
        const fullUserInfo = this.post('userInfo');
        const clientIp = this.ctx.ip;

        // 解释用户数据
        const {
            errno,
            errmsg,
            data: userInfo
        } = await this.service('weixin', 'api').login(code, fullUserInfo);
        if (errno !== 0) {
            return this.fail(errno, errmsg);
        }

        // 根据openid查找用户是否已经注册
        let userId = await this.model('user').where({
            weixin_openid: userInfo.openId
        }).getField('id', true);
        if (think.isEmpty(userId)) {
            // 注册
            userId = await this.model('user').add({
                username: '微信用户' + think.uuid(6),
                password: '',
                register_time: parseInt(new Date().getTime() / 1000),
                register_ip: clientIp,
                mobile: '',
                weixin_openid: userInfo.openId,
                avatar: userInfo.avatarUrl || '',
                gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
                nickname: userInfo.nickName
            });
        }

        // 查询用户信息
        const newUserInfo = await this.model('user').field(['id', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({
            id: userId
        }).find();

        // 更新登录信息
        await this.model('user').where({
            id: userId
        }).update({
            last_login_time: parseInt(new Date().getTime() / 1000),
            last_login_ip: clientIp
        });

        const TokenService = this.service('token', 'api');
        const sessionKey = await TokenService.create({
            user_id: userId
        });

        if (think.isEmpty(sessionKey)) {
            return this.fail('生成 token 失败');
        }

        return this.success({
            token: sessionKey,
            userInfo: newUserInfo
        });
    }

    async logoutAction() {
        return this.success();
    }
};