<template>
  <div>message</div>
</template>
<script>
import axios from "axios";

export default {
  name: "message",
  data: function () {
    return {};
  },
  computed: {},
  methods: {},
  components: {},
  async created() {
    let token = window.localStorage.getItem("token");
    let options = {
      url: this.$root.api.Message,
      timeout: 2000,
      headers: {'Authorization': token},
    };

    let res = await axios(options);
    console.log(res)
    if (res.data.errno == 401) {
      this.$store.commit("initFromWhere", { path: "/message" });
      console.log(token)
      this.$router.replace("/login");
    } else {
    }
  },
};
</script>