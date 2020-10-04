<template>
  <div>
    <div id="header">
      <div>
        <div id="logo">Welcome</div>
        <icon content="消息" link="/message"
          ><template v-slot:default
            ><img :src="MessSrc" onload="SVGInject(this)" /></template
        ></icon>
        <icon content="扫一扫" link="/"
          ><template v-slot:default
            ><img :src="QRSrc" onload="SVGInject(this)" /></template
        ></icon>
      </div>
      <div id="searchContainer" ref="searchContainer">
        <search @searchPage="isShow"></search>
      </div>
    </div>
    <rotation></rotation>
    <div id="channel">
      <icon
        v-for="(item, index) in kind"
        :key="index"
        :content="item.name"
        link="/"
      >
        <template v-slot:default><img :src="item.icon_url" /></template
      ></icon>
    </div>
    <div style="height: 6.7rem; opacity: 0">给scroll标签定位</div>
    <div id="product">
      <scroll :kind="kind" @fromNav="change"></scroll>
      <div
        ref="showPro"
        class="showPro"
        v-for="(keyItem, index) in kind"
        :key="keyItem['id']"
        :id="keyItem['id']"
        :class="{ top: isTop[index] }"
      >
        <showProduct
          v-for="item in cate[keyItem['id']]"
          :key="item.name"
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
  </div>
</template>
 
 
<script>
import Vue from "vue";
import axios from "axios";
import icon from "@/components/icon.vue";
import search from "@/components/search.vue";
import rotation from "@/components/rotation.vue";
import scroll from "@/components/scroll.vue";
import showProduct from "@/components/showProduct.vue";

import QR from "@/assets/img/QR.svg";
import Mess from "@/assets/img/message.svg";

let timer;
export default {
  name: "home",
  data: function () {
    return {
      QRSrc: QR,
      MessSrc: Mess,
      channel: [],
      kind: [],
      cate: {},
      isTop: [true],
      isShow:true
    };
  },
  computed: {},
  components: {
    search,
    icon,
    rotation,
    scroll,
    showProduct,
  },
  methods: {
    async change(id) {
      if (!this.cate.hasOwnProperty(id)) {
        // 不使用缓存
        let res3 = await axios.get(this.$root.api.CategoryRe + "?id=" + id);
        Vue.set(this.cate, id, res3.data.data.goodsList);
      }

      setTimeout(() => {
        this.lazyload(); //不延时的话还来不及加载新页面的图片
      }, 10);

      Array.prototype.forEach.call(this.$refs["showPro"], (item, index) => {
        if (item.getAttribute("id") != id) {
          Vue.set(this.isTop, index, false);
        } else {
          Vue.set(this.isTop, index, true);
        }
      });
      setTimeout(() => {
        this.changeHeight();
      }, 1);
    },
    initLazy() {
      this.lazyload();
      document.addEventListener("scroll", this.lazyload, false);
    },
    changeHeight() {
      var ele = document.querySelector(".top");
      this.$refs["searchContainer"].style.height =
        this.getElementTop(ele) + ele.offsetHeight + "px"; // 记得加单位
    }
  },
  async created() {
    let res2 = await axios.get(this.$root.api.Category);
    this.kind = res2.data.data.categoryList;

    let res3 = await axios.get(this.$root.api.CategoryRe);
    let id = res3.data.data.categoryId;
    Vue.set(this.cate, id, res3.data.data.goodsList);

    this.$nextTick(() => {
      this.initLazy();
      this.changeHeight();
    });
  },
  mounted(){
      document.querySelector("html").style.backgroundColor = '#f0f0f0';
  },
  destroyed(){
      document.querySelector("html").style.backgroundColor = '#fff';
  }
};
</script>
<style lang='less'>
@import "../assets/config/base.less";
#header {
  height: 10rem;
  margin: -0.6rem;
  margin-bottom: 1.2rem;
  background: @main-red;
  & > div:first-of-type {
    overflow: hidden;
    color: #fff;
    .icon {         
      width: 1.4rem;
      height: 1.4rem;
      margin-bottom: -0.7rem;
      path {
        fill: #fff;  //home的style设置为scoped时不起作用
      }
    }
    #logo {
      position: relative;
      float: left;
      top: 1.2rem;
      left: 0.7rem;
      font-size: 1.5rem;
    }
  }
  #searchContainer {
    position: relative; //正常流的z-index无效
    overflow: visible;
  }
}
#channel {
  position: relative;
  top: 9rem;
  margin: 0.5rem 1.2rem;
  z-index: 3;
  padding: 0.3rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
  background: #fff;
  border-radius: 1rem;
  & > div {
    margin: 0.3rem 0;
    img {
      width: 2.5rem;
    }
    div {
      font-size: 1.8rem !important;
    }
  }
}
#product {
  overflow: visible;
  .showPro {
    padding: 0.5rem 0 0 0.4rem;
    display: none;
  }
  .top {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>