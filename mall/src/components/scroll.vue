<template>
  <div id="wrapper">
    <div
      id="nav"
      :style="{ transform: transform }"
      @touchstart="start"
      @touchmove="manual"
      @touchend="end"
    >
      <div
        v-for="(item, index) in kind"
        :key="index"
        @click="change(item)"
        class="navItem"
        :class="{ active: isActive[index] }"
      >
        <div>{{ item.name }}</div>
        <div>{{ item.front_name }}</div>
      </div>
    </div>
  </div>
</template>
 
 
<script>
import axios from "axios";
export default {
  name: "scroll",
  data: function () {
    return {
      transform: "none",
      startX: 0,
      distanceX: 0,
      totalX: 0,
      isActive: [true],
    };
  },
  props: ["kind"],
  computed: {},
  components: {},
  methods: {
    start($event) {
      this.startX = $event.touches[0].clientX;
    },
    manual($event) {
      var endX = $event.touches[0].clientX;
      this.distanceX = endX - this.startX;

      // 检测是否移到尽头（this.totalX的值为0和-37500px（根据实际修改））
      if (this.totalX <= 0 && this.totalX >= -37500) {
        this.totalX = this.totalX + this.distanceX;
      } else if (this.totalX > 0) {
        this.totalX = 0;
      } else {
        this.totalX = -37500;
      }
      this.transform = `translateX(${this.totalX / 50}px)`;
    },
    end($event) {
      this.startX = 0;
      this.distanceX = 0;
    },
    change(item) {
      // Vue不能检测this.isActive[i]的变动，数据更新，但视图不更新
      //  数组原生方法触发视图更新: splice()、 push()、pop()、shift()、unshift()、sort()、reverse()
      for (var i = 0; i < this.kind.length; i++) {
        if (item.id != this.kind[i].id) {
          this.$set(this.isActive, i, false);
        } else {
          this.$set(this.isActive, i, true);
        }
      }
      this.$emit("fromNav", item.id);
    },
  },
  async mounted() {
    var wrapper = document.querySelector("#wrapper");
    // dom操作，不能在created中执行
    this.width = wrapper.offsetWidth;
    this.transform = `translateX(0px)`;
  },
};
</script>
<style lang="less" scoped>
@import "../assets/config/base.less";
#wrapper {
  position: sticky;
  top: 0rem;
  z-index: 2;
  background: @html-gray;
  overflow: hidden;
  &:before {
      content:'';
      display: block;
      height: 2.3rem;
  }
  #nav {
    width: 999rem;
    display: flex;
    .navItem {
      width: 8rem;
      text-align: center;
      div:first-of-type {
        font-weight: bold;
      }
      div:last-of-type {
        width: 7rem;
        margin: 0 auto;
        color: #8a8a8a;
        font-size: 0.4rem;
        border-radius: 999rem;
      }
    }
    .active {
      div:first-of-type {
        color: #f00 !important;
      }
      div:last-of-type {
        color: #fff !important;
        background-color: #f00;
      }
    }
  }
}
</style>