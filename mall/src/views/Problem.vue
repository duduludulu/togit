<template>
  <div>
    <!--多个评论-->
    <div>{{comment.count}}</div>
    <div>{{comment.data}}</div>
    
  </div>
</template>
<script>
import axios from "axios";
import { mapState, mapMutations, mapAction } from "vuex";
export default {
  name: "proPage",
  data: function () {
    return {
    };
  },
  computed: {
    ...mapState(["comment"]),
  },
  methods: {},
  components: {},
  async created() {
    // 区分直接通过链接请求/看完详情页再进入
    if (!this.$store.state.fromDetail) {
      let res = await axios.get(
        this.$root.api.GoodsDetail + "?id=" + this.$route.query.detailId
      );
      this.$store.dispatch("aboutComment", { comment: res.data.data.comment, fromDetail: true });
    }
  },
};
</script>