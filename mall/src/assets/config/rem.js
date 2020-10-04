(function () {
    function resize() {
        const baseFontSize = 30; 
        const designWidth = 750; //假设设计稿宽度为750px
        const width = window.innerWidth; // 屏幕宽度
        const currentFontSize = (width/designWidth)*baseFontSize;
        document.querySelector('html').style.fontSize = currentFontSize + 'px';   //得到页面字体实际默认大小
    }
    window.onresize = resize;
    document.addEventListener('DOMContentLoaded', resize);
})()