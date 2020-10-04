const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 获取sku信息，用于购物车编辑时选择规格
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async skuAction() {
    const goodsId = this.get('id');
    const model = this.model('goods');

    return this.success({
      specificationList: await model.getSpecificationList(goodsId),   //颜色等规格
      productList: await model.getProductList(goodsId)                //数量和价格
    });
  }

  /**
   * 商品详情页数据
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async detailAction() {
    const goodsId = this.get('id');
    const model = this.model('goods');

    const info = await model.where({'id': goodsId}).find();
    const gallery = await this.model('goods_gallery').where({goods_id: goodsId}).limit(4).select();
    const attribute = await this.model('goods_attribute').field('nideshop_goods_attribute.value, nideshop_attribute.name').join('nideshop_attribute ON nideshop_goods_attribute.attribute_id=nideshop_attribute.id').order({'nideshop_goods_attribute.id': 'asc'}).where({'nideshop_goods_attribute.goods_id': goodsId}).select();
    const issue = await this.model('goods_issue').select();   //常见问答(如运费)
    const brand = await this.model('brand').where({id: info.brand_id}).find();  //品牌信息
    // 用户评论和他们的个人信息
    const commentCount = await this.model('comment').where({value_id: goodsId, type_id: 0}).count();
    const hotComment = await this.model('comment').where({value_id: goodsId, type_id: 0}).find();
    let commentInfo = {};
    if (!think.isEmpty(hotComment)) {
      const commentUser = await this.model('user').field(['nickname', 'username', 'avatar']).where({id: hotComment.user_id}).find();
      commentInfo = {
        content: Buffer.from(hotComment.content, 'base64').toString(),
        add_time: think.datetime(new Date(hotComment.add_time * 1000)),
        nickname: commentUser.nickname,
        avatar: commentUser.avatar,
        pic_list: await this.model('comment_picture').where({comment_id: hotComment.id}).select()
      };
    }

    const comment = {
      count: commentCount,
      data: commentInfo
    };

    // 当前用户是否收藏（ isUserHasCollect(userId, typeId, valueId) ）
    // TODO:怎么更新收藏记录？类似addFootprint？
    const userHasCollect = await this.model('collect').isUserHasCollect(this.getLoginUserId(), 0, goodsId);

    // 记录用户的足迹 TODO
    await await this.model('footprint').addFootprint(this.getLoginUserId(), goodsId);

    return this.success({   
      info: info,
      gallery: gallery,    // 轮播图
      attribute: attribute,
      userHasCollect: userHasCollect,
      issue: issue,
      comment: comment,
      brand: brand,
      specificationList: await model.getSpecificationList(goodsId),
      productList: await model.getProductList(goodsId)
    });
  }

  /**
   * 获取分类下的商品
   * @returns {Promise.<*>}
   */
  async categoryAction() {
    const model = this.model('category');
    const currentCategory = await model.where({id: this.get('id')}).find();
    const parentCategory = await model.where({id: currentCategory.parent_id}).find();
    const brotherCategory = await model.where({parent_id: currentCategory.parent_id}).select();

    return this.success({
      currentCategory: currentCategory,
      parentCategory: parentCategory,
      brotherCategory: brotherCategory
    });
  }

  /**
   * 通过不同的url查询字符串获取相应的商品列表
   * @returns {Promise.<*>}
   */
  async listAction() {
    const categoryId = this.get('categoryId');
    const brandId = this.get('brandId');
    const keyword = this.get('keyword');
    const isNew = this.get('isNew');          //isNew的值为1时获取新品，0表示非新品
    const isHot = this.get('isHot');
    const page = this.get('page');
    const size = this.get('size');
    const sort = this.get('sort');
    const order = this.get('order');

    const goodsQuery = this.model('goods');

    //whereMap说明搜索关键词、是否为新品或热销产品，如果url直接给出categoryId也要放进whereMap里
    const whereMap = {};
    if (!think.isEmpty(isNew)) {
      whereMap.is_new = isNew;
    }

    if (!think.isEmpty(isHot)) {
      whereMap.is_hot = isHot;
    }

    if (!think.isEmpty(keyword)) {
      whereMap.name = ['like', `%${keyword}%`];
    }

    if (!think.isEmpty(brandId)) {
      whereMap.brand_id = brandId;
    }

    // 排序
    let orderMap = {};
    if (sort === 'price') {
      // 按价格（具体order由用户决定：desc或asc）
      orderMap = {
        retail_price: order
      };
    } else if(sort === 'sales'){
        // 销量
        orderMap = {
          sell_volume: order
        };
    }else {
      // 按商品添加时间
      orderMap = {
        id: 'desc'
    };
    }

    // 筛选的分类：可以是关键词下的所有商品的所有父级分类中的某一个，也可以展示全部（checked用来判断选择哪个分类方式）
    let filterCategory = [{
      'id': 0,
      'name': '全部',
      'checked': false
    }];   
    //根据搜索关键词、是否为新品或热销产品确定可能的分类id，并确定所有父级分类  
    const categoryIds = await goodsQuery.where(whereMap).getField('category_id', 10000);//10000限定了条数
    if (!think.isEmpty(categoryIds)) {
      // 查找二级分类的parent_id，从而可以得到后面的一级分类
      const parentIds = await this.model('category').where({id: {'in': categoryIds}}).getField('parent_id', 10000);
      // 一级分类
      const parentCategory = await this.model('category').field(['id', 'name']).order({'sort_order': 'asc'}).where({'id': {'in': parentIds}}).select();

      if (!think.isEmpty(parentCategory)) {
        filterCategory = filterCategory.concat(parentCategory);
      }
    }

    // 如果url直接给出categoryId
    if (!think.isEmpty(categoryId) && parseInt(categoryId) > 0) {
      whereMap.category_id = ['in', await this.model('category').getCategoryWhereIn(categoryId)];
    // getCategoryWhereIn(categoryId)找到categoryId的所有子类id和它自己
    }

    // 搜索到的商品(存在goodsData.data里)
    const goodsData = await goodsQuery.where(whereMap).field(['id', 'name', 'list_pic_url', 'retail_price']).order(orderMap).page(page, size).countSelect();
    // page(page, size)规定当前页数和每页条数。countSelect()分页查询数据
    // 设定filterCategory的每个元素的checked
    goodsData.filterCategory = filterCategory.map(function(v) {  
      // url没有直接给出categoryId时才使用filterCategory（存在checked为true的元素）
      v.checked = (think.isEmpty(categoryId) && v.id === 0) || v.id === parseInt(categoryId);
      return v;
    });

    return this.success(goodsData);
  }

//   /**这部分没用吧？
//    * 商品列表筛选的分类列表
//    * @returns {Promise.<Promise|void|PreventPromise>}
//    */
//   async filterAction() {
//     const categoryId = this.get('categoryId');
//     const keyword = this.get('keyword');
//     const isNew = this.get('isNew');
//     const isHot = this.get('isHot');

//     const goodsQuery = this.model('goods');

//     if (!think.isEmpty(categoryId)) {
//       goodsQuery.where({category_id: {'in': await this.model('category').getChildCategoryId(categoryId)}});
//     }

//     if (!think.isEmpty(isNew)) {
//       goodsQuery.where({is_new: isNew});
//     }

//     if (!think.isEmpty(isHot)) {
//       goodsQuery.where({is_hot: isHot});
//     }

//     if (!think.isEmpty(keyword)) {
//       goodsQuery.where({name: {'like': `%${keyword}%`}});
//     }

//     let filterCategory = [{
//       'id': 0,
//       'name': '全部'
//     }];

//     // 二级分类id
//     const categoryIds = await goodsQuery.getField('category_id', 10000);
//     if (!think.isEmpty(categoryIds)) {
//       // 查找二级分类的parent_id
//       const parentIds = await this.model('category').where({id: {'in': categoryIds}}).getField('parent_id', 10000);
//       // 一级分类
//       const parentCategory = await this.model('category').field(['id', 'name']).order({'sort_order': 'asc'}).where({'id': {'in': parentIds}}).select();

//       if (!think.isEmpty(parentCategory)) {
//         filterCategory = filterCategory.concat(parentCategory);
//       }
//     }

//     return this.success(filterCategory);
//   }

  /**
   * 新品首发
   * @returns {Promise.<Promise|void|PreventPromise>}
   */
  async newAction() {
    return this.success({
      bannerInfo: {
        url: '',
        name: '坚持初心，为你寻觅世间好物',
        img_url: 'http://yanxuan.nosdn.127.net/8976116db321744084774643a933c5ce.png'
      }
    });
  }

  /**
   * 人气推荐
   * @returns {Promise.<Promise|void|PreventPromise>}
   */
  async hotAction() {
    return this.success({
      bannerInfo: {
        url: '',
        name: '大家都在买的好物',
        img_url: 'http://yanxuan.nosdn.127.net/8976116db321744084774643a933c5ce.png'
      }
    });
  }

  /**
   * 商品详情页的大家都在看的商品
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async relatedAction() {
    // 大家都在看商品,取出关联表的商品，如果没有则随机取同分类下的商品（限定数目）
    const model = this.model('goods');
    const goodsId = this.get('id');
    const relatedGoodsIds = await this.model('related_goods').where({goods_id: goodsId}).getField('related_goods_id');
    let relatedGoods = null;
    if (think.isEmpty(relatedGoodsIds)) {
      // 查找同分类下的商品
      const goodsCategory = await model.where({id: goodsId}).find();
      relatedGoods = await model.where({category_id: goodsCategory.category_id}).field(['id', 'name', 'list_pic_url', 'retail_price']).limit(8).select();
    } else {
      relatedGoods = await model.where({id: ['IN', relatedGoodsIds]}).field(['id', 'name', 'list_pic_url', 'retail_price']).select();
    }

    return this.success({
      goodsList: relatedGoods
    });
  }

  
  /**
   * 在售的商品总数
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async countAction() {
    const goodsCount = await this.model('goods').where({is_delete: 0, is_on_sale: 1}).count('id');

    return this.success({
      goodsCount: goodsCount
    });
  }
};
