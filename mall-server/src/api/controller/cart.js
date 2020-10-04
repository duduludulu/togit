const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 获取购物车中的数据
   * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
   */
  async getCart() {
    const cartList = await this.model('cart').where({user_id: this.getLoginUserId(), session_id: 1}).select();
    // 获取购物车统计信息
    let goodsCount = 0;
    let goodsAmount = 0.00;
    let checkedGoodsCount = 0;
    let checkedGoodsAmount = 0.00;
    for (const cartItem of cartList) {
      goodsCount += cartItem.number;
      goodsAmount += cartItem.number * cartItem.retail_price;
      if (!think.isEmpty(cartItem.checked)) {
        checkedGoodsCount += cartItem.number;
        checkedGoodsAmount += cartItem.number * cartItem.retail_price;
      }

      // 查找商品的图片。getField('list_pic_url', true)表示获取单个字段的一个值而非数组 
      cartItem.list_pic_url = await this.model('goods').where({id: cartItem.goods_id}).getField('list_pic_url', true);
    }

    return {
      cartList: cartList,
      cartTotal: {
        goodsCount: goodsCount,
        goodsAmount: goodsAmount,
        checkedGoodsCount: checkedGoodsCount,
        checkedGoodsAmount: checkedGoodsAmount
      }
    };
  }

  /**
   * 获取购物车信息。后面所有对购物车的增删改操作，也要重新返回购物车的信息
   */
  async indexAction() {
    return this.success(await this.getCart());
  }

  /**
   * 添加商品到购物车
   * @returns {Promise.<*>}
   */
  async addAction() {
    const goodsId = this.post('goodsId');
    const productId = this.post('productId');
    const number = parseInt(this.post('number'));

    // 判断商品是否可以购买
    const goodsInfo = await this.model('goods').where({id: goodsId}).find();
    if (think.isEmpty(goodsInfo) || goodsInfo.is_delete === 1) {
      return this.fail(400, '商品已下架');
    }

    // 取得规格的信息,判断规格库存
    const productInfo = await this.model('product').where({goods_id: goodsId, id: productId}).find();
    if (think.isEmpty(productInfo) || productInfo.goods_number < number) {
      return this.fail(400, '库存不足');
    }

    // 判断购物车中是否存在此规格商品
    const cartInfo = await this.model('cart').where({goods_id: goodsId, product_id: productId}).find();
    if (think.isEmpty(cartInfo)) {   
      // 如果不存在，添加商品的具体规格(样式)要求
      let goodsSpecificationValue = [];
      if (!think.isEmpty(productInfo.goods_specification_ids)) {
        goodsSpecificationValue = await this.model('goods_specification').where({
          goods_id: goodsId,
          id: {'in': productInfo.goods_specification_ids.split('_')}
        }).getField('value');
      }

      // 添加到购物车（给cart表新增一条数据，因此cartData的属性跟cart的字段一样）
      const cartData = {
        goods_id: goodsId,
        product_id: productId,
        goods_sn: productInfo.goods_sn,  
        goods_name: goodsInfo.name,
        list_pic_url: goodsInfo.list_pic_url,
        number: number,
        session_id: 1, 
        user_id: this.getLoginUserId(),
        retail_price: productInfo.retail_price,
        market_price: productInfo.retail_price,
        goods_specification_name_value: goodsSpecificationValue.join(';'),
        goods_specification_ids: productInfo.goods_specification_ids,
        checked: 1
      };
      await this.model('cart').add(cartData);
      // 当{product_id: productId}条件不存在时添加cartData进cart表
      // await this.model('cart').thenAdd(cartData, {product_id: productId});
    } else {
      // 如果已经存在购物车中，则修改number字段
      if (productInfo.goods_number < (number + cartInfo.number)) {
        return this.fail(400, '库存不足');
      }

      await this.model('cart').where({
        goods_id: goodsId,
        product_id: productId,
        id: cartInfo.id
      }).increment('number', number);
    }
    return this.success(await this.getCart());
  }

  /**
   * 直接修改购物车页面的信息
   */
  async updateAction() {
    const goodsId = this.post('goodsId');
    const productId = this.post('productId'); // 新的product_id
    const id = this.post('id'); // cart.id
    const number = parseInt(this.post('number')); 

    // 取得规格的信息,判断规格库存
    const productInfo = await this.model('product').where({goods_id: goodsId, id: productId}).find();
    if (think.isEmpty(productInfo) || productInfo.goods_number < number) {
      return this.fail(400, '库存不足');
    }

    // 改变某个购物车栏上的数目
    const cartInfo = await this.model('cart').where({id: id}).find();
    if (cartInfo.product_id === productId) {            //进一步核实是同个规格的商品
      await this.model('cart').where({id: id}).update({
        number: number
      });

      return this.success(await this.getCart());
    }

    const newCartInfo = await this.model('cart').where({goods_id: goodsId, product_id: productId}).find();
    if (think.isEmpty(newCartInfo)) {
      // 添加规格名和值
      // goods_specification表混着存放颜色和规格，再利用specification表可以区分哪些是颜色，哪些是规格 
      let goodsSpecification = [];
      if (!think.isEmpty(productInfo.goods_specification_ids)) {
        goodsSpecification = await this.model('goods_specification').alias('gs')
        .field(['gs.*', 's.name'])
        .join({
            table: 'specification',
            join: 'inner',
            as: 's',
            on: ['specification_id', 'id']  //找到gs.specification_id=s.id
        })    
        .where({
          goods_id: goodsId,
          id: {'in': productInfo.goods_specification_ids.split('_')}
        }).select();
      }
      const cartData = {
        number: number,
        goods_specification_name_value: JSON.stringify(goodsSpecification), //和上面的添加购物车内容有啥区别？
        goods_specification_ids: productInfo.goods_specification_ids,
        retail_price: productInfo.retail_price,
        market_price: productInfo.retail_price,
        product_id: productId,
        goods_sn: productInfo.goods_sn
      };

      await this.model('cart').where({id: id}).update(cartData);
    } else {
      // 合并购物车已有的product信息，删除已有的数据（为什么要合并？不能增加或更新吗？）
      const newNumber = number + newCartInfo.number;

      if (think.isEmpty(productInfo) || productInfo.goods_number < newNumber) {
        return this.fail(400, '库存不足');
      }

      await this.model('cart').where({id: newCartInfo.id}).delete();

      const cartData = {
        number: newNumber,
        goods_specification_name_value: newCartInfo.goods_specification_name_value,
        goods_specification_ids: newCartInfo.goods_specification_ids,
        retail_price: productInfo.retail_price,
        market_price: productInfo.retail_price,
        product_id: productId,
        goods_sn: productInfo.goods_sn
      };

      await this.model('cart').where({id: id}).update(cartData);
    
    }
    return this.success(await this.getCart());
  
  }
  // 是否选择商品，如果已经选择，则取消选择，批量操作(怎么批量？)
  async checkedAction() {
    let productId = this.post('productIds').toString();
    const isChecked = this.post('isChecked');

    if (think.isEmpty(productId)) {
      return this.fail('删除出错');
    }

    productIds = productId.split(',');
    await this.model('cart').where({product_id: {'in': productIds}}).update({checked: parseInt(isChecked)});

    return this.success(await this.getCart());
  }

  // 删除选中的购物车商品，批量删除
  async deleteAction() {
    let productId = this.post('productIds');
    if (!think.isString(productId)) {
      return this.fail('删除出错');
    }

    productIds = productId.split(',');
    await this.model('cart').where({product_id: {'in': productIds}}).delete();

    return this.success(await this.getCart());
  }

  // 获取购物车商品的总件件数
  async goodsCountAction() {
    const cartData = await this.getCart();
    return this.success({
      cartTotal: {
        goodsCount: cartData.cartTotal.goodsCount
      }
    });
  }

  /**
   * 订单提交前的检验和填写相关订单信息  TODO:未看
   * @returns {Promise.<void>}
   */
  async checkoutAction() {
    const addressId = this.get('addressId'); // 收货地址id
    // const couponId = this.get('couponId'); // 使用的优惠券id

    // 选择的收货地址
    let checkedAddress = null;
    if (addressId) {
      checkedAddress = await this.model('address').where({is_default: 1, user_id: this.getLoginUserId()}).find();
    } else {
      checkedAddress = await this.model('address').where({id: addressId, user_id: this.getLoginUserId()}).find();
    }

    if (!think.isEmpty(checkedAddress)) {
      checkedAddress.province_name = await this.model('region').getRegionName(checkedAddress.province_id);
      checkedAddress.city_name = await this.model('region').getRegionName(checkedAddress.city_id);
      checkedAddress.district_name = await this.model('region').getRegionName(checkedAddress.district_id);
      checkedAddress.full_region = checkedAddress.province_name + checkedAddress.city_name + checkedAddress.district_name;
    }

    // 根据收货地址计算运费
    const freightPrice = 0.00;

    // 获取要购买的商品
    const cartData = await this.getCart();
    const checkedGoodsList = cartData.cartList.filter(function(v) {
      return v.checked === 1;
    });

    // 获取可用的优惠券信息，功能还示实现
    const couponList = await this.model('user_coupon').select();
    const couponPrice = 0.00; // 使用优惠券减免的金额

    // 计算订单的费用
    const goodsTotalPrice = cartData.cartTotal.checkedGoodsAmount; // 商品总价
    const orderTotalPrice = cartData.cartTotal.checkedGoodsAmount + freightPrice - couponPrice; // 订单的总价
    const actualPrice = orderTotalPrice - 0.00; // 减去其它支付的金额后，要实际支付的金额

    return this.success({
      checkedAddress: checkedAddress,
      freightPrice: freightPrice,
      checkedCoupon: {},
      couponList: couponList,
      couponPrice: couponPrice,
      checkedGoodsList: checkedGoodsList,
      goodsTotalPrice: goodsTotalPrice,
      orderTotalPrice: orderTotalPrice,
      actualPrice: actualPrice
    });
  }
};
