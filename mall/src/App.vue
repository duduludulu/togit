<template>
  <div id="appStyle">
    <router-view></router-view>
    <div id="footer">
      <icon
        content="首页"
        link="/"
        @click="red('Home')"
        :class="{ red: isRed[0] }"
        ><template v-slot:default
          ><img :src="HomeSrc" onload="SVGInject(this)" /></template
      ></icon>
      <icon
        content="分类"
        link="/category"
        @click="red('Cate')"
        :class="{ red: isRed[1] }"
        ><template v-slot:default
          ><img :src="CateSrc" onload="SVGInject(this)" /></template
      ></icon>
      <icon
        content="购物车"
        link="/cart"
        @click="red('Cart')"
        :class="{ red: isRed[2] }"
        ><template v-slot:default
          ><img :src="CartSrc" onload="SVGInject(this)" /></template
      ></icon>
      <icon
        content="个人"
        link="/mine"
        @click="red('Mine')"
        :class="{ red: isRed[3] }"
        ><template v-slot:default
          ><img :src="MineSrc" onload="SVGInject(this)" /></template
      ></icon>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import icon from "./components/icon.vue";

import Home from "@/assets/img/home.svg";
import Cate from "@/assets/img/cate.svg";
import Cart from "@/assets/img/cart.svg";
import Mine from "@/assets/img/mine.svg";

export default {
  data: function () {
    return {
      data: {},
      HomeSrc: Home,
      CateSrc: Cate,
      CartSrc: Cart,
      MineSrc: Mine,
      iconArr: ["Home", "Cate", "Cart", "Mine"],
      isRed: [],
      placeholderList: [],
      index: 0,
    };
  },
  components: {
    icon,
  },
  methods: {
    red(arr) {
      for (var i = 0; i < this.iconArr.length; i++) {
        if (arr != this.iconArr[i]) {
          this.$set(this.isRed, i, false);
        } else {
          this.$set(this.isRed, i, true);
        }
      }
    },
  },
  async mounted() {
    let j;
    switch (this.$route.path) {
      case "/category":
        j = 1;
        break;
      case "/cart":
        j = 2;
        break;
      case "/mine":
        j = 3;
        break;
      default:
        j = 0;
    }
    for (var i = 0; i < this.iconArr.length; i++) {
      if (i != j) {
        this.$set(this.isRed, i, false);
      } else {
        this.$set(this.isRed, i, true);
      }
    }

    let res = await axios.get(this.$root.api.SearchKeyword);
    this.placeholderList = res.data.data.defaultKeyword;
    this.$store.commit("initPHtimer", { placeholderList: this.placeholderList });
  },
};
</script>
<style lang="less">
@import "./assets/config/base.less";
html {
  background: #fff;
}
#appStyle {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
#footer {
  position: fixed;
  left: 0;
  bottom: -0.2rem;
  z-index: 100;
  width: 100%;
  display: flex;
  overflow: hidden;
  background-color: #fff;
  border-top: solid 1px @img-gray;
  color: @img-gray;
  .item {
    flex: 1;
  }
  .icon {
    width: 1.4rem;
    height: 1.4rem;
    margin-bottom: -0.7rem;
  }
  .red {
    color: #f00;
    .icon path {
      fill: #f00;
    }
  }
}
</style>
