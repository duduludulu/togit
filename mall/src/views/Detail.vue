<template>
  <div>
    <div>宝贝评价详情推荐。下滑到一定地方才显示</div>
    <div id="banner">
      轮播图
      <img v-for="(item,index) in data.gallery" :src="item.img_url" :key="index" />
    </div>
    <div>
      <div>￥{{info.retail_price}}</div>
      <div>{{info.name}}</div>
      <div>{{info.goods_brief}}</div>
      库存，销量
    </div>
    <div>商品评价(num)关键词，部分展示，点开是评论页面</div>
    <div class="problem">
      常见问题
      <span @click="proPage">查看全部</span>
    </div>
    <div class="goods_desc" v-html="info.goods_desc">商品详情</div>
    <div>商品推荐整齐排版</div>
  </div>
</template>
 
 
<script>
import axios from "axios";
export default {
  name: "detail",
  data: function () {
    return {
      data: {},
      info: {},
    };
  },
  methods: {
    proPage() {
      this.$store.dispatch("aboutComment", { comment: this.data.comment, fromDetail: true });
      this.$router.push(`/detail/pro/?detailId=${this.$route.query.detailId}`); //路由跳转
    },
  },
  components: {},
  async created() {
    // 1006002
    let res = await axios.get(
      this.$root.api.GoodsDetail + "?id=" + this.$route.query.detailId
    );
    this.data = res.data.data;
    this.info = this.data.info;
    console.log(this.data);
  },
};
</script>
<style lang='less'>
#banner {
  img {
    position: absolute;
    display: none;
  }
}
.problem {
  height: 50px;
  span {
    float: right;
  }
}
.goods_desc {
  img {
    width: 100%;
  }
  display: none;
}
</style>