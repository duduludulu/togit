<template>
  <div class="login-container" @keydown.enter="submit">
    <img src="../assets/img/cancelPage.svg" id="cpImg" @click="back" />
    <div @click="register">注册</div>
    <form ref="form">
      <div>欢迎登录</div>
      <div class="inputBox">
        <input
          id="mobile"
          name="mobile"
          type="number"
          placeholder="手机号"
          v-model="dataContent"
          @focus="isFocusfn(true, 0)"
          @blur="isFocusfn(false, 0)"
        />
        <img
          src="../assets/img/cancel.svg"
          :class="{ isHidden: isHidden[0] }"
          @click="clearContent('name')"
          class="inputImg"
        />
      </div>
      <div class="inputBox">
        <input
          id="password"
          name="password"
          :type="inputType"
          placeholder="请输入密码"
          v-model="password"
          @focus="isFocusfn(true, 1)"
          @blur="isFocusfn(false, 1)"
        /><img
          src="../assets/img/cancel.svg"
          :class="{ isHidden: isHidden[1] }"
          @click="clearContent('password')"
          class="inputImg"
        /><img :src="imgSrc" @click="isSeen" class="inputImg" />
      </div>
      <div id="checkItem">
        <input type="checkbox" id="checkbox" ref="check" @click="canlogin" />
        <label for="checkbox">
          <img src="../assets/img/check.svg" onload="SVGInject(this)"
        /></label>
        <div>同意<span>《服务条款》</span></div>
        <span>忘记密码</span>
      </div>
      <input
        type="button"
        value="登录"
        ref="submit"
        :disabled="disabled"
        @click="submit"
      />
    </form>
    <div id="error" v-if="errShow">
      <img src="../assets/img/cancelPage.svg" @click="errShow = false" />
      <div>{{ err }}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import icon from "@/components/icon.vue";
import see from "@/assets/img/see.svg";
import notsee from "@/assets/img/notsee.svg";
export default {
  name: "login",
  data() {
    return {
      data: {},
      isHidden: [true, true],
      isFocus: true,
      dataContent: "",
      password: "",
      inputType: "password",
      imgSrc: notsee,
      disabled: true,
      err: "",
      errShow: false,
    };
  },
  watch: {
    dataContent: function (val) {
      if (val) {
        this.$set(this.isHidden, 0, false);
      } else {
        this.$set(this.isHidden, 0, true);
      }
      this.canlogin();
    },
    password: function (val) {
      if (val) {
        this.$set(this.isHidden, 1, false);
      } else {
        this.$set(this.isHidden, 1, true);
      }
      this.canlogin();
    },
  },
  computed: {},
  methods: {
    back() {
      this.$router.go(-1);
    },
    register() {
      this.$router.replace("./register");
    },
    clearContent(arg) {
      if (arg == "name") {
        this.dataContent = "";
      } else {
        this.password = "";
      }
    },
    isSeen() {
      this.inputType = this.inputType == "password" ? "text" : "password";
      this.imgSrc = this.imgSrc == see ? notsee : see;
    },
    isFocusfn(focus, index) {
      if (index == 0) {
        if (focus & (this.dataContent == "")) {
          return;
        }
      } else {
        if (focus & (this.password == "")) {
          return;
        }
      }
      setTimeout(() => {
        //如果是因为点击cancel icon而失去聚焦，需要给出时间执行clearContent
        this.$set(this.isHidden, index, !focus);
      }, 200);
    },
    canlogin() {
      let [name, password] = [
        this.dataContent.replace(/\s+/g, ""),
        this.password.replace(/\s+/g, ""),
      ];

      if (name && password && this.$refs["check"].checked) {
        this.$refs["submit"].removeAttribute("disabled");
      } else {
        this.$refs["submit"].setAttribute("disabled", true);
      }
    },
    async submit() {
      // 可以用的用户信息： 12345678910/123456
      if (!this.$refs["submit"].disabled) {
        let myForm = this.$refs["form"];
        let formData = new FormData(myForm);
        let options = {
          url: this.$root.api.Login,
          method: "post",
          data: formData,
          timeout: 2000,
        };

        let res = await axios(options);
        if (res.data.errno == 401) {
          this.errShow = true;
          this.err = res.data.errmsg;
        } else {
          window.localStorage.setItem("token", res.data.data.token);
          this.updateKeyword();
          this.$router.push(this.$store.state.fromWhere);
        }
      }
    },
  },
  components: { icon },
};
</script>

<style lang="less">
@import "../assets/config/base.less";
#cpImg {
  width: 1.7rem;
  & + div {
    float: right;
  }
}
.inputImg {
  position: relative;
  z-index: 2;
  top: 0.5rem;
  width: 1.4rem;
}
form {
  position: relative;
  top: 6rem;
  text-align: center;
  background-color: #fff; //确保isHidden起作用
  & > div:first-of-type {
    margin-bottom: 2.5rem;
    font-size: 2rem;
    color: #f00;
  }
  .inputBox {
    margin: 1rem 0 0 1.8rem;
    width: 20.2rem;
    .border-bottom();
    #mobile,
    #password {
      .input();
      padding: 0.5rem 0;
      font-weight: 600;
      &::-webkit-input-placeholder {
        color: #999;
        font-weight: 400;
      }
    }
    #mobile {
      width: 18rem;
    }
    #password {
      width: 16.5rem;
    }
  }
  .isHidden {
    z-index: -2;
  }
  input[type="button"] {
    .input();
    width: 20.2rem;
    padding: 0.5rem;
    border-radius: 999rem;
    background: #f00;
    color: #fff;
    &:disabled {
      opacity: 0.5;
    }
  }
  #checkItem {
    display: flex;
    margin: 0 1.8rem 3rem 2rem;
    font-size: 0.5rem;
    .icon {
      width: 1rem;
      height: 1rem;
      margin: 0.1rem 0.1rem;
    }
    input[type="checkbox"] {
      position: absolute;
      z-index: -2;
      & + label {
        .checked {
          opacity: 0;
        }
      }
      &:checked + label {
        .checked {
          opacity: 1;
        }
      }
    }
    span:last-of-type {
      margin-left: auto;
    }
  }
}
#error {
  position: relative;
  top: -8rem;
  z-index: 3;
  width: 20rem;
  height: 10rem;
  margin: auto auto;
  border-radius: 1rem;
  box-shadow: 0 0.5px 2px rgba(0, 0, 0, 0.8);
  background: #fff;

  display: flex;
  justify-items: center;
  img {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    width: 1.2rem;
    box-shadow: inset 0 0 1px rgba(0, 102, 153, 0.2);
  }
  & > div {
    width: 15rem;
    margin: auto;
    text-align: center;
    line-height: 5rem;
  }
}
</style>