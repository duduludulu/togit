const Base = require('./base.js');

module.exports = class extends Base {
    async indexAction() {
        // 取出输入框默认的关键词
        let user_id = this.getLoginUserId();
        const defaultKeyword = await this.model('keywords').where({
            is_default: 1
        }).limit(10).getField('keyword');
        const hotKeywordList = await this.model('keywords').distinct('keyword').where({
            is_hot: 1
        }).limit(10).getField('keyword');

        if (user_id == 0) {
            var historyKeywordList = null;
        } else {
            var historyKeywordList = await this.model('search_history').distinct('keyword').where({
                user_id: user_id
            }).limit(10).getField('keyword');
        }

        return this.success({
            defaultKeyword: defaultKeyword,
            historyKeywordList: historyKeywordList,
            hotKeywordList: hotKeywordList,
            user_id:user_id
        });
    }

    async helperAction() {
        const keyword = this.get('keyword');
        const keywords = await this.model('keywords').where({
            keyword: ['like', '%' + keyword + '%']
        }).getField('keyword');
        return this.success(keywords);
    }


    // history的实时逐条添加是在发送关键词时就完成的
    async clearAction() {
        let user_id = this.getLoginUserId();
        if (user_id == 0) {
            return this.fail(401, '用户未登录');
        }
        const result = await this.model('search_history').where({
            user_id: user_id
        }).delete();
        return this.success();
    }

    async updateAction() {
        let arr = this.post();
        // 可能不能直接使用JSON的函数
        let user_id = this.getLoginUserId();
        if (user_id == 0) {
            return this.fail(401, '用户未登录');
        }
        for (let i = 0; i < arr.length; i++) {
            let keyword = arr[i].keyword;
            let add_time = arr[i].add_time;
            await this.model('search_history').thenUpdate({
                user_id: user_id,
                keyword: keyword,
                add_time: add_time
            }, {
                user_id: user_id,
                keyword: keyword,
            });
        }
        return this.success();
    }
};