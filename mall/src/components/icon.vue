<template>
  <div class="item" @click="change()">
    <slot></slot>
    <div class="font-11px">{{ content }}</div>
  </div>
</template>
<script>
export default {
  name: "icon",
  props: ["content", "link"],
  methods: {
    change($event) {
      if (this.link && this.$route.path !== this.link) {
        this.$router.push({ path: this.link });
      }
      this.$emit("click");
    },
  },
};
</script>
<style lang="less" scoped>
.item {
  float: right;
  overflow: hidden;
  text-align: center;
  margin: 0.3rem 0 0 -0.9rem;
  img {
    width: 1.4rem;
    margin-bottom: -0.7rem;
  }
  .font-11px {
    transform: scale(0.5);
    font-size: 22px;
  }
}
</style>