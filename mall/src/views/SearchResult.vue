<template>
  <div class="searchResult">
    <div class="title">
      <div id="title">
        <icon content="" link="" @click="back"
          ><template v-slot:default
            ><img src="../assets/img/back.svg" /></template
        ></icon>
        <search id="input"></search>
      </div>
      <div id="orderMap">
        <div :class="{ active: isActive[0] }" @click="red(0)">默认</div>
        <div
          :class="{
            active: isActive[1],
          }"
          @click="
            changePriceOrder();
            red(1);
          "
        >
          价格
          <span
            :class="{
              activeIncre: isActiveIn[0],
              activeDecre: !isActiveIn[0],
            }"
          >
            <img
              src="../assets/img/order.svg"
              class="order"
              onload="SVGInject(this)"
            />
          </span>
        </div>
        <div
          :class="{
            active: isActive[2],
          }"
          @click="
            changeSalesOrder();
            red(2);
          "
        >
          销量<span
            :class="{
              activeIncre: isActiveIn[1],
              activeDecre: !isActiveIn[1],
            }"
            ><img
              src="../assets/img/order.svg"
              class="order"
              @click="isActiveIn[1] = !isActiveIn[1]"
              onload="SVGInject(this)"
            />
          </span>
        </div>
      </div>
    </div>
    <div id="searchProduct">
      <showProduct
        v-for="(item, index) in goodsData"
        :key="index"
        :name="item.name"
        :price="item.retail_price"
        ><template v-slot:default><img :src="item.list_pic_url" /></template
      ></showProduct>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import search from "@/components/search.vue";
import icon from "@/components/icon.vue";
import showProduct from "@/components/showProduct.vue";

export default {
  name: "searchResult",
  data() {
    return {
      keyword: "",
      sort: "",
      isActive: [true],
      isActiveIn: [true, true],
      order: ["asc", "asc"],
      goodsData: [],
      count: 0,
    };
  },
  computed: {},
  methods: {
    back() {
      this.$router.go(-1);
    },
    red(num) {
      for (let i = 0; i < 3; i++) {
        if (i != num) {
          this.$set(this.isActive, i, false);
        } else {
          this.$set(this.isActive, i, true);
        }
      }
      switch (num) {
        case 0:
          this.sort = "default";
          this.getResult();
          break;
        case 1:
          this.sort = "price";
          this.getResult(0);
          break;
        case 2:
          this.sort = "sales";
          this.getResult(1);
          break;
      }
    },
    changePriceOrder() {
      if (this.isActive[1] == true) {
        this.$set(this.isActiveIn, 0, !this.isActiveIn[0]);
        let order = this.order[0] == "desc" ? "asc" : "desc";
        this.$set(this.order, 0, order);
      }
    },
    changeSalesOrder() {
      if (this.isActive[2] == true) {
        this.$set(this.isActiveIn, 1, !this.isActiveIn[1]);
        let order = this.order[1] == "desc" ? "asc" : "desc";
        this.$set(this.order, 1, order);
      }
    },
    async getResult(index = 0) {
      let res = await axios.get(
        this.$root.api.GoodsList +
          `?keyword=${this.keyword}&sort=${this.sort}&order=${this.order[index]}`
      );
      this.goodsData = res.data.data.data;
    },
  },
  components: {
    search,
    icon,
    showProduct,
  },
  async created() {
    [this.keyword, this.sort] = [
      this.$route.query.keyword,
      this.$route.query.sort,
    ];
    this.getResult();

    let j;
    switch (this.sort) {
      case "price":
        j = 1;
        break;
      case "sales":
        j = 2;
        break;
      default:
        j = 0;
    }
    for (let i = 0; i < 3; i++) {
      if (i != j) {
        this.$set(this.isActive, i, false);
      } else {
        this.$set(this.isActive, i, true);
      }
    }
  },
  mounted() {
    document.querySelector("#input input").value = this.keyword;
  },
};
</script>
<style lang="less">
@import "../assets/config/base.less";

.searchResult {
  margin: 0 -0.52rem;
  .title {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background: #fff;
    #title {
      display: flex;
      padding: 0.7rem 1rem;
      #input {
        width: 20rem;
        margin-left: auto;
        input {
          width: 15.5rem;
        }
      }
    }
    #orderMap {
      position: relative;
      left: 0;
      right: 0;
      padding: 0.5rem;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      justify-items: center;
      .border-bottom();
      .order {
        width: 1.2rem;
        height: 1.2rem; //高度必须限制
        margin-bottom: -0.2rem;
      }

      .active {
        color: #f00;
        .activeIncre {
          //这个类名直接加在img上就无想要的变化效果
          .incre {
            fill: #f00;
          }
        }
        .activeDecre {
          .decri {
            fill: #f00;
          }
        }
      }
    }
  }
}
#searchProduct {
  position: relative;
  background-color: #fff;
  top: 2rem;
  padding: 4rem 0.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;
}
</style>