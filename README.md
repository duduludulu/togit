## 技术栈
前端：vue2 + vuex + vue-router + vue-cli + less + axios
后端：thinkJS + MySQL

## 源资源

original_resource存放可以使用的数据库和api，本人的项目使用的数据和api基于此进行修改。以下为提供源资源的up主的教学视频
https://www.bilibili.com/video/BV1m741137Q5?p=5

## 功能说明和展示:
### 首页
![首页](README_md_files/%E9%A6%96%E9%A1%B5.gif?v=1&type=image)
### 商品分类
+ 第一次点击某个大分类后会缓存，不重复请求
![首页的分类](README_md_files/%E9%A6%96%E9%A1%B5%E7%9A%84%E5%88%86%E7%B1%BB.gif?v=1&type=image)
![分类](README_md_files/%E5%88%86%E7%B1%BB.gif?v=1&type=image)
### 登录和认证功能
+ mall-server/src/api/config/config.js和mall-server/src/api/controller/base.js对权限进行限制
+ 使用token进行认证(通过登录或注册获取)，mall-server/src/api/service/token.js设置过期时间为1h
![登录成功](README_md_files/%E7%99%BB%E5%BD%95%E6%88%90%E5%8A%9F.gif?v=1&type=image)
![登录失败](README_md_files/%E7%99%BB%E5%BD%95%E5%A4%B1%E8%B4%A5.gif?v=1&type=image)
![注册成功](README_md_files/%E6%B3%A8%E5%86%8C%E6%88%90%E5%8A%9F.gif?v=1&type=image)
![注册失败](README_md_files/%E6%B3%A8%E5%86%8C%E5%A4%B1%E8%B4%A5.gif?v=1&type=image)
### 搜索功能
+ 认证状态是否通过会影响历史记录的展示(未登录时使用localStorage进行增删，登录后根据user_id直接对数据库进行操作，刚登录时会把localStorage的记录同步到数据库上)
+ 输入时尝试弹出常见关键词(访问了数据库)，同时使用节流
+ 不同位置的搜索框的placeholder进行共享，而且聚焦时会暂停变化(vuex)
![认证后的历史记录](README_md_files/%E5%B7%B2%E7%99%BB%E5%BD%95%E5%90%8E%E7%9A%84%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.gif?v=1&type=image)
![未认证的历史记录](README_md_files/%E4%B8%8D%E7%99%BB%E5%BD%95%E6%97%B6%E7%9A%84%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.gif?v=1&type=image)
![推荐关键词](README_md_files/%E6%8E%A8%E8%8D%90%E5%85%B3%E9%94%AE%E8%AF%8D.gif?v=1&type=image)
### 商品排序
![排序](README_md_files/%E6%8E%92%E5%BA%8F.gif?v=1&type=image)
### 重要组件
+ 轮播图(translateX): 自动轮播、无缝衔接、手动控制轮播
![轮播图](README_md_files/%E8%BD%AE%E6%92%AD%E5%9B%BE.gif?v=1&type=image)
+ 分类导航(参照轮播图的实现方式，使用translateX)：点击后出现对应的分类内容，点击过的会缓存
+ 可修改样式的svg icon：使用svg-inject插件, 用于商品排序；登录页的checkbox；解决路由切换时，底部图标和文字加载速度不一致的问题
+ 商品展示：图片懒加载

## 如何调试
运行前请先安装nodejs
克隆两个项目到本地
### 后端(mall-server)为前端提供了api接口
+ 在自己的mysql操作管理处创建自己的database，导入nideshop.sql 
```
CREATE SCHEMA `nideshop` DEFAULT CHARACTER SET utf8mb4 ;
```
还需要更改数据库配置
src/common/config/database.js
```
module.exports = {
handle: mysql,
database: 'nideshop',
prefix: 'nideshop_',
encoding: 'utf8mb4',
host: '127.0.0.1',
port: '3306',
user: 'root',
password: '你的密码',
dateStrings: true
};
```
+ npm安装依赖并启动
```
npm install(首次使用就安装)
npm start (开发环境调试)
```
之后就可以通过 http://127.0.0.1:8360/api 访问接口

### 前端(mall)
+ npm安装依赖并启动
```
npm install
npm run serve (Compiles and hot-reloads for development)
npm run build (Compiles and minifies for production)
```
一般通过http://localhost:8080访问页面
### API接口文件
assets/config/api.js
