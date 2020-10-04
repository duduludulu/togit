<template>
  <div>
    <!--多个评论-->
    <div>{{data.specificationList[0].name}}</div>
    <div>{{data.productList}}</div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "sku",
  data: function () {
    return {
        data:{}
    };
  },
  computed: {
      // 缓存用户的选项
  },
  methods: {},
  components: {},
  async created() {
    // 只有id=1181000的商品有数据。再去添加两个内容，方便测试购物车
    let res = await axios.get(
      this.$root.api.GoodsSku + "?id=" + this.$route.query.detailId
    );
    this.data = res.data.data;
    console.log(this.data)
  },
};
</script>