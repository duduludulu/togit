<template>
  <div>
    <div id="title">
      <icon content="" link="" @click="back"
        ><template v-slot:default><img src="../assets/img/back.svg" /></template
      ></icon>
      <div id="name">{{ currentCategory.name }}</div>
      <icon content="" link="/search"
        ><template v-slot:default
          ><img src="../assets/img/search.svg" /></template
      ></icon>
    </div>
    <div id="product" class="top">
      <showProduct
        v-for="(item, index) in data.goodsList"
        :key="index"
        :name="item.name"
        :price="item.retail_price"
        ><template v-slot:default
          ><img
            src=""
            lazyload="true"
            :original="item.list_pic_url"
            ref="lazy" /></template
      ></showProduct>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import showProduct from "@/components/showProduct.vue";
import icon from "@/components/icon.vue";

export default {
  name: "subCategory",
  data() {
    return {
      data: {},
      currentCategory: {},
    };
  },
  computed: {},
  methods: {
    initLazy() {
      this.lazyload();
      document.addEventListener("scroll", this.lazyload, false);
    },
    back() {
      this.$router.go(-1);
    },
  },
  components: {
    icon,
    showProduct,
  },
  async created() {
    // 锅和布艺软装的分类下确定有商品
    let res = await axios.get(
      this.$root.api.CategoryRe + "?id=" + this.$route.query.cateId
    );
    this.data = res.data.data;
    let res2 = await axios.get(
      this.$root.api.GoodsCategory + "?id=" + this.$route.query.cateId
    );
    this.currentCategory = res2.data.data.currentCategory;

    this.$nextTick(() => {
      this.initLazy();
    });
  },
};
</script>
<style lang='less' scoped>
@import "../assets/config/base.less";
#title {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2.3rem;
  z-index: 2;
  background: #fff;
  display: flex;
  .border-bottom();
  .item:first-of-type {
    margin: 0.15rem auto 0 0.2rem;
  }
  .item:last-of-type {
    margin: 0.15rem 0.6rem 0 auto;
  }
  #name {
    font-weight: 600;
    font-size: 1.2rem;
    align-self: center;
  }
}

#product {
  position: relative;
  top: 2rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>