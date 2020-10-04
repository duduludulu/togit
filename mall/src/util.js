import axios from "axios";
export default {
    install(Vue, options) {
        Vue.prototype.debounce = function (fun, delay) {
            let timer;
            return function (args) {
                let that = this;
                // 重写计时器
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fun.call(that, args);
                }, delay)
            }
        };
        Vue.prototype.throttle = function (fun, delay) {
                let lastTime, deferTimer;
                return function (args) {
                    let that = this;
                    let now = +new Date();
                    //js在某个数据类型前使用‘+’, 是为了将该数据类型转换为Number类型
                    if (lastTime && now - lastTime < delay) {
                        // lastTime并没有立刻修改为now,而是推迟了
                        clearTimeout(deferTimer);
                        deferTimer = setTimeout(function () {
                            fun.call(that, args);
                            lastTime = now;
                        }, delay)
                    } else {
                        fun.call(that, args);
                        lastTime = now;
                    }
                }
            },
            Vue.prototype.getElementTop = function (ele) {
                var actualTop = ele.offsetTop;
                var current = ele.offsetParent;

                while (current !== null) {
                    actualTop += current.offsetTop;
                    current = current.offsetParent;
                }
                return actualTop;
            },
            Vue.prototype.lazyload = function () {
                let viewHeight = document.documentElement.clientHeight;
                var eles = document.querySelectorAll(".top img[original][lazyload]");
                Array.prototype.forEach.call(eles, (item, index) => {
                    // 注意ref 需要在dom渲染完成后才会有
                    var rect = item.getBoundingClientRect(); //这个元素相对于左上角的位置
                    if (rect.top < viewHeight * 2 && rect.bottom > -viewHeight) {
                        // 利用Image,首屏图片的显示会快一点
                        var img = new Image();
                        img.src = item.getAttribute("original");
                        img.onload = function () {
                            item.src = img.src;
                        };
                        item.removeAttribute("lazyload");
                    }
                });
            },
            Vue.prototype.updateKeyword = async function () {
                let arr = JSON.parse(window.localStorage.getItem('history'));
                let token = window.localStorage.getItem("token");
                let options = {
                    url: this.$root.api.HistoryUpdate,
                    method: "post",
                    data: arr,
                    timeout: 2000,
                    headers: { Authorization: token },
                  };
                await axios(options);
            }
    }
}