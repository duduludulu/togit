<template>
  <div id="banner">
    <div
      id="wrapper"
      :style="{ transition: transition, transform: transform }"
      @touchstart="start"
      @touchmove="manual"
      @touchend="end"
    >
      <img
        v-for="(item, index) in currentBanner"
        :src="item.image_url"
        :key="index"
      />
    </div>
    <ul class="radius">
      <li
        v-for="index in introLen"
        :key="index"
        :class="{ active: isActives[index - 1] }"
      ></li>
    </ul>
  </div>
</template>
 
 
<script>
import axios from "axios";
export default {
  name: "rotation",
  data: function () {
    return {
      intro: {},
      currentBanner: {},
      banner: {},
      introLen: 0,
      isActives: [],

      transition: "none",
      transform: 0,
      wrapIndex: 1,
      timer: null,
      width: 0,
      imgWidth: 22,
      startX: 0,
      distanceX: 0,
      isMove: false,
    };
  },
  computed: {},
  components: {},
  methods: {
    start($event) {
      clearInterval(this.timer);
      this.timer = null; // 真正销毁
      this.startX = $event.touches[0].clientX;
    },
    manual($event) {
      var endX = $event.touches[0].clientX;
      this.distanceX = endX - this.startX;
      // 在当前页的translateX基础上加distanceX，而非下一页的translateX
      var translateX = -this.wrapIndex * this.width + this.distanceX;
      this.transition = "none";
      this.transform = `translateX(${translateX}px)`;

      this.isMove = true;
    },
    end($event) {
      if (this.isMove && Math.abs(this.distanceX) > this.width / 4) {
        // 当滑动超过了一定的距离最终需要跳到下一张或者上一张
        if (this.distanceX > 0) {
          this.wrapIndex--;
        } else {
          this.wrapIndex++;
        }
      }

      this.addTransition();
      this.transform = `translateX(${-this.wrapIndex * this.width}px)`;
      this.setPoint();

      // 偷偷换回第一张和最后一张
      if (this.wrapIndex == this.introLen + 1) {
        setTimeout(() => {
          this.transition = "none";
          this.transform = `translateX(${-this.width}px)`;
          this.wrapIndex = 1;
        }, 500);
      } else if (this.wrapIndex == 0) {
        setTimeout(() => {
          this.transition = "none";
          this.transform = `translateX(${-this.introLen * this.width}px)`;
          this.wrapIndex = this.introLen;
        }, 500);
      }

      //重新初始化
      this.startX = 0;
      this.distanceX = 0;
      this.isMove = false;
      this.timer = setInterval(() => {
        this.addTransition();
        this.transform = `translateX(${-(this.wrapIndex + 1) * this.width}px)`;
        if (this.wrapIndex == this.introLen + 1) {
          this.transition = "none";
          this.transform = `translateX(${-this.width}px)`;
          this.wrapIndex = 0;
        }
        this.wrapIndex++;
        this.setPoint();
      }, 2500);
    },
  },
  async created() {
    let res = await axios.get(this.$root.api.IndexUrl);
    this.intro = res.data.data;
    this.introLen = this.intro.banner.length;
    this.banner = this.intro.banner;
    this.banner.push(this.intro.banner[0]);
    this.banner.unshift(this.intro.banner[this.introLen - 1]);

    for (var i = 0; i < this.introLen; i++) {
      if (i != 0) {
        this.isActives[i] = false;
      } else {
        this.isActives[i] = true;
      }
    }

    var wrapper = document.querySelector("#wrapper");
    this.width = wrapper.offsetWidth;
    this.transform = `translateX(${-this.width}px)`;
    this.currentBanner = this.banner;

    this.addTransition = function () {
      this.transition = "all 0.3s";
    };
    this.setPoint = function () {
      var len = this.isActives.length;
      for (var i = 0; i < len; i++) {
        this.isActives[i] = false;
      }
      if (this.wrapIndex == this.introLen + 1) {
        this.isActives[0] = true;
      } else if (this.wrapIndex == 0) {
        this.isActives[this.introLen - 1] = true;
      } else {
        this.isActives[this.wrapIndex - 1] = true;
      }
    };

    this.timer = setInterval(() => {
      this.addTransition();
      this.transform = `translateX(${-(this.wrapIndex + 1) * this.width}px)`;
      if (this.wrapIndex == this.introLen + 1) {
        this.transition = "none";
        this.transform = `translateX(${-this.width}px)`; // 无缝衔接
        this.wrapIndex = 0;
      }
      this.wrapIndex++;
      this.setPoint();
    }, 2500);
    //对于setInterval, 要使用箭头函数.此时函数的this指向的是定义它时的对象，也就是this指向了data内中对应的变量
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>
<style lang="less" scoped>
@import "../assets/config/base.less";
#banner {
  position: absolute;
  left: 1.5rem;
  top: 7rem;
  width: 22rem;
  height: 12.3rem;
  overflow: hidden; // 隐藏框外的图片
  z-index: 3;
  // 放在最高层，后面的组件的文字就不会闪动
  #wrapper {
    position: absolute;
    display: flex;
    width: 22rem;
    img {
      width: 22rem;
      border-radius: 1rem;
      flex: 1;
    }
  }
  .radius {
    position: absolute;
    top: 10rem;
    right: 0.8rem;
    display: flex;
    li {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 999rem;
      margin: 0 0.2rem;
      list-style: none;
      background-color: #fff;
      // 小圆点的颜色，相对于里面的文字就是背景
      opacity: 0.6;
    }
    .active {
      opacity: 1;
      background-color: @main-red;
    }
  }
}
</style>