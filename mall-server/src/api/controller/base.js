module.exports = class extends think.Controller {
  async __before() {
    // __before 是在调用具体的 Action 之前调用的
    // 根据token值获取用户id
    this.ctx.state.token = this.ctx.header['authorization'] || '';
    const tokenService = think.service('token', 'api');
    this.ctx.state.userId = await tokenService.getUserId(this.ctx.state.token);

    const publicController = this.config('publicController');
    const publicAction = this.config('publicAction');
    // 如果为非公开，则验证用户是否登录
    const controllerAction = this.ctx.controller + '/' + this.ctx.action;
    if (!publicController.includes(this.ctx.controller) && !publicAction.includes(controllerAction)) {
      if (this.ctx.state.userId <= 0) {
        return this.fail(401, '请先登录');  
        // promise对象执行结束后返回错误信息(res.data)
      }
    }
  }

  /**
   * 获取时间戳
   * @returns {Number}
   */
  getTime() {
    return parseInt(Date.now() / 1000);
  }

  /**
   * 获取当前登录用户的id
   * @returns {*}
   */
  getLoginUserId() {
    return this.ctx.state.userId;
  }
};
