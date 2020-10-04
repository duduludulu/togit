function _asyncToGenerator(fn) {
    return function () {
        var gen = fn.apply(this, arguments);
        return new Promise(function (resolve, reject) {
            function step(key, arg) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    return Promise.resolve(value).then(function (value) {
                        step("next", value);
                    }, function (err) {
                        step("throw", err);
                    });
                }
            }
            return step("next");
        });
    };
}

const Base = require('./base.js');

module.exports = class extends Base {
    /**
     * 获取分类栏目数据
     * @returns {Promise.<Promise|void|PreventPromise>}
     */
    indexAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const categoryId = _this.get('id');
            const model = _this.model('category');
            const data = yield model.where({
                parent_id: 0
            }).select();

            let currentCategory = null;
            if (categoryId) {
                currentCategory = yield model.where({
                    'id': categoryId
                }).find();
            } else {
                currentCategory = data[0];
            }

            // 获取子分类数据     
            currentCategory.subCategoryList = yield model.where({
                'parent_id': currentCategory.id
            }).select();

            return _this.success({
                categoryList: data,
                currentCategory: currentCategory
            });
        })();
    }
    /**
     * 分类下随机推荐具体商品
     * @returns {Promise.<Promise|PreventPromise|void>}
     */
    async recommendAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let categoryId = _this.get('id');
            //在home页时要求是parent_id: 0的分类中的一种(大分类)，在Category页面时传入的是小分类id
            const model = _this.model('category');
            const model2 = _this.model('goods');
            const data = yield model.where({
                parent_id: 0
            }).select();
            let currentCategory = categoryId ? categoryId : data[0].id;
            let goodsList;

            const categoryList = yield model.where({
                parent_id: currentCategory
            }).getField('id', 10000);
            if (categoryList.length != 0) {
                goodsList = yield model2.where({
                    category_id: {
                        'in': categoryList
                    }
                }).field(['id', 'name', 'list_pic_url', 'retail_price']).select();
            } else {
                goodsList = yield model2.where({
                    category_id: categoryId
                }).field(['id', 'name', 'list_pic_url', 'retail_price']).select();
            }

            return _this.success({
                categoryId: currentCategory,
                goodsList: goodsList
            });
        })();
    }
    /**
     * 可以随机推荐具体商品的类别名
     * @returns {Promise.<Promise|PreventPromise|void>}
     */
    async categoryAction() {
        var _this = this;
        return _asyncToGenerator(function* () {
            const model = _this.model('category');
            const list = yield model.where({
                parent_id: 0
            }).field(['id', 'name', 'icon_url', 'front_name']).select();

            return _this.success({
                categoryList: list
            });
        })();
    }
}