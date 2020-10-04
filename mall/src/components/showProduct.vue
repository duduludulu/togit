<template>
  <div class="show">
    <div class="pic">
        <slot></slot>
    </div>
    <div class="intro">
      <div class="name">{{ name }}</div>
      <div class="price">￥{{ price }}</div>
    </div>
  </div>
</template>
 
 
<script>
export default {
  name: "showProduct",
  data: function () {
    return {
    };
  },
  props: ["name", "price", ],
  computed: {},
  components: {},
};
</script>
<style lang="less" scoped>
.show {
  position: relative;
  width: 11rem;
  margin: 0.4rem 0.2rem;
  .pic {
    position: relative;
    height: 12.5rem;
    overflow: hidden;
    border-radius: 0.5rem 0.5rem 0 0;
    background-color: #f5f5f5;
    img {
      position: relative;
      top: -2.8rem;
      left: -3.5rem;
      width: 18rem;
    }
  }
  .intro {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
    border-radius: 0 0 0.5rem 0.5rem;
    background-color: #fff;
    .price {
      color: #f00;
      font-size: 1.1rem;
      font-weight: 600;
    }
  }
}
</style>