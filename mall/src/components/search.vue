<template>
  <div>
    <img src="../assets/img/search.svg" />
    <input
      :placeholder="placeholder"
      v-model="dataContent"
      @focus="searchPage"
      @blur="phRestart"
      @keyup.enter="searchData"
    />
    <img
      src="../assets/img/cancel.svg"
      :class="{ isHidden: isHidden }"
      @click="clearContent"
    />
  </div>
</template>
 
 
<script>
import { mapState, mapMutations, mapAction } from "vuex";
export default {
  name: "search",
  data: function () {
    return {
      isHidden: true,
      dataContent: "",
      keyword: "",
    };
  },
  methods: {
    searchPage() {
      this.$store.commit("phStop");
      if (this.$route.path != "/search") {
        if (this.keyword) {
          this.$router.push("/search" + "?keyword=" + this.keyword);
        } else {
          this.$router.push("/search");
        }
      }
    },
    phRestart() {
      this.$store.commit("phRestart");
    },
    clearContent() {
      this.dataContent = "";
      this.keyword = "";
    },
    searchData() {
      this.$emit("search", this.dataContent);
    },
  },
  watch: {
    dataContent: function (val) {
      this.$emit("changeContent", val);
      //先修改父组件的content,后面的helper关键词才能及时变化
      if (val) {
        this.isHidden = false;
        this.$emit("showhelperkw", true);
      } else {
        this.isHidden = true;
        this.$emit("showhelperkw", false);
      }
    },
  },
  computed: {
    ...mapState(["placeholder"]),
  },
  created() {
    let keyword = this.$route.query.keyword;
    if (keyword) {
      this.dataContent = keyword;
      this.keyword = keyword;
    }
  },
};
</script>
<style lang="less" scoped>
@import "../assets/config/base.less";
@main-color: #e6e6e6;
div {
  z-index: 4;
  position: sticky;
  top: 0;
  margin: 0 0.5rem;
  padding: 0.5rem;
  border-radius: 999rem;
  background-color: @main-color;
  overflow: hidden;
  img {
    width: 1.2rem;
    &:first-of-type {
      float: left;
    }
    &:last-of-type {
      float: right;
    }
  }
  input {
    float: left;
    width: 18rem;
    height: 1.2rem;
    margin-left: 0.5rem;
    .input();
    background-color: @main-color;
  }
  .isHidden {
    display: none;
  }
}
</style>