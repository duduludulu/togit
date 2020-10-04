<template>
  <div class="searchPage">
    <div id="title">
      <search
        id="input"
        @showhelperkw="showhelperkw"
        @changeContent="changeContent"
        @search="search"
      ></search>
      <span @click="back">取消</span>
    </div>
    <div id="helperkw" v-show="isShowhelper">
      <li v-for="(item, index) in helper" :key="index" @click="search(item)">
        {{ item }}
      </li>
    </div>
    <div id="options">
      <div id="history">
        <div class="subhead">历史记录</div>
        <img src="../assets/img/trash.svg" @click="clearHistory" />
      </div>
      <div class="keycontainer">
        <div
          v-for="(item, index) in historyKeyword"
          :key="index"
          class="keyitem"
          @click="search(item)"
        >
          {{ item }}
        </div>
      </div>
      <div id="hot">
        <div class="subhead">热门搜索</div>
        <div class="keycontainer">
          <div
            v-for="(item, index) in keyword.hotKeywordList"
            :key="index"
            class="keyitem"
            @click="search(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import search from "@/components/search.vue";

// helper用“鞋”校验，后面的具体展示页用“碗”校验
let token = window.localStorage.getItem("token");
export default {
  name: "searchPage",
  data() {
    return {
      goodsData: [],
      count: 0,
      keyword: {},
      historyKeyword: [],
      content: "",
      isShowhelper: false,
      helper: [],
    };
  },
  computed: {},
  methods: {
    addLocalStorage(obj) {
      let record = JSON.parse(window.localStorage.getItem("history"));
      if (record == null) {
        record = [obj];
      } else {
        for (let i = 0; i < record.length; i++) {
          if (record[i].keyword == this.content) {
            record.splice(i, 1);
          }
        }
        record.push(obj);
      }
      window.localStorage.setItem("history", JSON.stringify(record));
    },
    deleteLocalStorage() {
      // 想要实现单个的删除，可以设置toRemove清单
      window.localStorage.removeItem("history");
    },
    async clearHistory() {
      this.historyKeyword = [];
      let options = {
        url: this.$root.api.HistoryDelete,
        timeout: 2000,
        headers: { Authorization: token },
      };
      let res = await axios(options);
      if (res.data.errno && res.data.errno == 401) {
        this.deleteLocalStorage();
      }
    },
    async search(dataContent) {
      this.content = dataContent;
      let add_time = parseInt(new Date().getTime() / 1000);
      let obj = {
        keyword: this.content,
        add_time: add_time,
      };
      let arr = [];
      arr.push(obj);
      let options = {
        url: this.$root.api.HistoryUpdate,
        method: "post",
        data: arr,
        timeout: 2000,
        headers: { Authorization: token },
      };

      let res = await axios(options);
      if (res.data.errno && res.data.errno == 401) {
        this.addLocalStorage(obj);
      }
      this.go();
    },
    go() {
      this.$router.replace(
        `/search/result?keyword=${this.content}&sort=default`
      );
    },
    back() {
      this.$router.go(-1);
    },
    async showhelperkw(arg) {
      this.isShowhelper = arg;

      if (this.content && this.helperfn) {
        this.helperfn(this.content);
      } else {
        this.helper = "";
      }
    },
    changeContent(dataContent) {
      dataContent = dataContent.replace(/\s+/g, "");
      this.content = dataContent;
    },
  },
  components: {
    search,
  },
  async created() {
    let options = {
      url: this.$root.api.SearchKeyword,
      timeout: 2000,
      headers: { Authorization: token },
    };
    let res1 = await axios(options);
    this.keyword = res1.data.data;
    this.historyKeyword = this.keyword.historyKeywordList;

    // 当用户未登录时历史记录来自localStorage
    if (this.historyKeyword == null) {
      var arr = [];
      let record = JSON.parse(window.localStorage.getItem("history"));
      if (record) {
        for (let i = 0; i < record.length; i++) {
          arr.push(record[i].keyword);
        }
      }
      this.historyKeyword = arr;
    }

    async function findKeyword(str) {
      let res = await axios.get(
        this.$root.api.SearchHelper + "?keyword=" + str
      );
      this.helper = res.data.data;
    }
    this.helperfn = this.throttle(findKeyword, 100);
  },
  mounted() {
    document.querySelector("input").focus();
  },
};
</script>
<style lang="less">
@import "../assets/config/base.less";

.searchPage {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: #fff;
  #title {
    display: flex;
    padding: 0.7rem 0.5rem;
    .border-bottom();
    #input {
      width: 19rem;
      input {
        width: 15.5rem;
      }
    }
    span {
      margin: auto;
    }
  }
  img {
    width: 1.2rem;
    margin-left: auto;
  }
  #options {
    position: relative;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 8;
    padding: 0 1rem;
    .subhead {
      font-weight: 600;
      margin: 1rem 0 0.6rem 0;
    }
    #history {
      display: flex;
    }
  }
  .keycontainer {
    display: flex;
    flex-wrap: wrap;
    .keyitem {
      background: #e6e6e6;
      padding: 0.3rem 0.8rem;
      margin: 0.2rem;
      border-radius: 999rem;
    }
  }
  #helperkw {
    position: absolute;
    top: 4rem;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9;
    background: #fff;
    li {
      list-style: none;
      margin: 0 1rem;
      padding: 0.5rem;
      .border-bottom();
    }
  }
}
</style>