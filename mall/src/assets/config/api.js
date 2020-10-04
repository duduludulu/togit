const ApiRootUrl = 'http://127.0.0.1:8360/api/';
//与mall-server\src\api\config\config.js之类的配置文件相对应
module.exports = {
    Register: ApiRootUrl + 'auth/register', //注册
    Login: ApiRootUrl + 'auth/login', //登录
    AuthLoginByWeixin: ApiRootUrl + 'auth/loginByWeixin', //微信登录
    Message: ApiRootUrl +'user/getMessage',   // 获取用户收到的信息
    HistoryUpdate:ApiRootUrl +'search/update',  // 更新关键字的历史记录
    HistoryDelete:ApiRootUrl +'search/clear',  // 清空关键字的历史记录

    IndexUrl: ApiRootUrl + 'index/index', //首页数据接口 mall-server\src\api\controller\index.js的第一个action
    CategoryList: ApiRootUrl + 'category/index', //分类目录全部和当前分类数据接口 
    Category: ApiRootUrl + 'category/category',   // 可以随机推荐具体商品的类别名
    CategoryRe: ApiRootUrl + 'category/recommend',  // 分类下随机推荐具体商品
    GoodsCategory: ApiRootUrl + 'goods/category', //获得分类数据（当前类别、父类、同类）
    GoodsNew: ApiRootUrl + 'goods/new', //新品横幅
    GoodsHot: ApiRootUrl + 'goods/hot', //热门横幅

    GoodsList: ApiRootUrl + 'goods/list', //获得商品列表（用关键词搜索商品得到的列表，关键词会留下记录，支持排序）
    //request(api.GoodsCategory, { id: this.data.id })
    GoodsDetail: ApiRootUrl + 'goods/detail', //获得商品的详情（包括商品评论、收藏、足迹）
    GoodsRelated: ApiRootUrl + 'goods/related', //商品详情页的关联商品（大家都在看）
    GoodsSku: ApiRootUrl + 'goods/sku',   // 购买商品时选择具体的商品特性


    SearchKeyword: ApiRootUrl + 'search/index',
    SearchHelper: ApiRootUrl + 'search/helper',
    
    BrandList: ApiRootUrl + 'brand/list', //品牌列表
    BrandDetail: ApiRootUrl + 'brand/detail', //品牌详情

    CartList: ApiRootUrl + 'cart/index', //获取购物车的数据
    CartAdd: ApiRootUrl + 'cart/add', // 添加商品到购物车
    //{ goodsId: this.data.goods.id, number: this.data.number, productId: checkedProduct[0].id }, "POST"
    CartUpdate: ApiRootUrl + 'cart/update', // 更新购物车的商品
    /* api.CartUpdate, {
      productId: productId,
      goodsId: goodsId,
      number: number,
      id: id
    }, 'POST' */
    CartDelete: ApiRootUrl + 'cart/delete', // 删除购物车的商品
    //{productIds: productIds.join(',')}, 'POST'
    CartChecked: ApiRootUrl + 'cart/checked', // 选择或取消选择商品
    // { productIds: productIds.join(','), isChecked: that.isCheckedAll() ? 0 : 1 }, 'POST'
    CartGoodsCount: ApiRootUrl + 'cart/goodscount', // 获取购物车商品件数
    CartCheckout: ApiRootUrl + 'cart/checkout', // 下单前信息确认
    //{ addressId: that.data.addressId, couponId: that.data.couponId }

    OrderSubmit: ApiRootUrl + 'order/submit', // 提交订单
    //{ addressId: this.data.addressId, couponId: this.data.couponId }, 'POST'
    PayPrepayId: ApiRootUrl + 'pay/prepay', //获取微信统一下单prepay_id

    CollectList: ApiRootUrl + 'collect/list', //收藏列表
    //api.CollectList, { typeId: that.data.typeId}
    CollectAddOrDelete: ApiRootUrl + 'collect/addordelete', //添加或取消收藏

    CommentList: ApiRootUrl + 'comment/list', //评论列表
    CommentCount: ApiRootUrl + 'comment/count', //评论总数
    CommentPost: ApiRootUrl + 'comment/post', //发表评论

    TopicList: ApiRootUrl + 'topic/list', //专题列表
    TopicDetail: ApiRootUrl + 'topic/detail', //专题详情
    TopicRelated: ApiRootUrl + 'topic/related', //相关专题

    SearchIndex: ApiRootUrl + 'search/index', //搜索页面数据
    SearchResult: ApiRootUrl + 'search/result', //搜索数据
    SearchHelper: ApiRootUrl + 'search/helper', //搜索帮助
    SearchClearHistory: ApiRootUrl + 'search/clearhistory', //搜索帮助

    AddressList: ApiRootUrl + 'address/list', //收货地址列表
    AddressDetail: ApiRootUrl + 'address/detail', //收货地址详情
    AddressSave: ApiRootUrl + 'address/save', //保存收货地址
    AddressDelete: ApiRootUrl + 'address/delete', //保存收货地址

    RegionList: ApiRootUrl + 'region/list', //获取区域列表

    OrderList: ApiRootUrl + 'order/list', //订单列表
    OrderDetail: ApiRootUrl + 'order/detail', //订单详情
    OrderCancel: ApiRootUrl + 'order/cancel', //取消订单
    OrderExpress: ApiRootUrl + 'order/express', //物流详情

    FootprintList: ApiRootUrl + 'footprint/list', //足迹列表
    FootprintDelete: ApiRootUrl + 'footprint/delete', //删除足迹
};