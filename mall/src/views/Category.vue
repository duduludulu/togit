<template>
  <div>
    <div id="bgcolor"></div>
    <div id="lbgcolor"></div>
    <div id="search">
      <span>分类</span>
      <search></search>
    </div>
    <div id="move"></div>
    <div id="category">
      <div id="category-list">
        <li
          v-for="(item, index) in showData.categoryList"
          :key="index"
          @click="change(item.id)"
          :class="{ active: isActive[index] }"
        >
          {{ item.name }}
        </li>
      </div>
      <div id="category-current">
        <icon
          v-for="(item, index) in subCategoryList"
          :key="index"
          :content="item.name"
          @click="intoSub(item.id)"
          class="picShow"
        >
          <template v-slot:default><img :src="item.wap_banner_url" /></template
        ></icon>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import search from "@/components/search.vue";
import icon from "@/components/icon.vue";

export default {
  name: "category",
  data() {
    return {
      data: {},
      showData: {},
      subCategoryList: [],
      isActive: [true],
    };
  },
  watch: {
    showData() {
      this.subCategoryList = this.showData.currentCategory.subCategoryList;
    },
  },
  methods: {
    async change(id) {
      if (this.data.hasOwnProperty(id)) {
        // 使用缓存
        this.showData = this.data[id];
      } else {
        let res = await axios.get(this.$root.api.CategoryList + "?id=" + id);
        var id = res.data.data.currentCategory.id;
        Vue.set(this.data, id, res.data.data);
        this.showData = this.data[id];
      }
      let j;
      for (var i = 0; i < this.showData.categoryList.length; i++) {
        if (id != this.showData.categoryList[i].id) {
          this.$set(this.isActive, i, false);
        } else {
          this.$set(this.isActive, i, true);
          j = i;
        }
      }
      let el = document.querySelector("#move");
      el.style.top = `calc(5rem + 3.37rem * ${j})`;
      // 如果使用tranlateY，比它高层的文字会闪烁
      el.style.transition = "all 1s";
    },
    intoSub(id) {
      this.$router.push(`/category/subCategory?cateId=${id}`); //路由跳转
    },
  },
  async mounted() {
    let res = await axios.get(this.$root.api.CategoryList);
    let id = res.data.data.currentCategory.id;
    Vue.set(this.data, id, res.data.data); //给原对象新增属性
    this.showData = this.data[id];
  },
  components: {
    search,
    icon
  },
};
</script>
<style lang='less'>
@import "../assets/config/base.less";

@left-width: 5rem;

#bgcolor {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
}
#lbgcolor {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: @left-width;
  background: @html-gray;
}
#move {
  position: absolute;
  left: 0;
  top: 5rem; //5rem + 3.37rem * n
  z-index: 2;
  width: @left-width;
  height: 3.4rem;
  border-left: #f00 solid 2.5px;
  background-color: #fff;
}
#search {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4;
  width: 100%;
  padding: 0.6rem 0.5rem;
  background-color: #fff;
  .border-bottom();
  text-align: center;
  span {
    font-weight: 600;
  }
  div {
    margin-top: 0.3rem;
    width: 22rem;
  }
}

#category {
  position: relative;
  top: 4.6rem;
  left: 0;
  z-index: 3;
  #category-list {
    float: left;
    width: @left-width;
    li {
      padding: 1rem;
      list-style: none;
    }
    .active {
      color: #f00;
    }
  }
  #category-current {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    margin: 0 0 4rem 5rem;
    .picShow {
      width: 32%;
      margin: 0 0.1rem;
      img {
        width: 6.5rem;
      }
      .font-11px {
        transform: scale(0.7);
      }
    }
  }
}
</style>