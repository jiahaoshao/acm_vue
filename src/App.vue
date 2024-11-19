<template>
  <div id="app">
    <!-- <h1 class="title">创意交流平台</h1> -->
    <!-- 路由的出口 -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.title {
  font-family: 'Arial', sans-serif;
  font-size: 36pm     ;
  font-weight: 700;
  color: black;  /* 文字颜色设为黑色 */
  text-align: left;  /* 使文本对齐到左边 */
  margin-left: 20px;  /* 左侧边距，确保文字不紧贴页面边缘 */
  letter-spacing: 2px;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);  /* 轻微的阴影效果 */
  animation: bounce 2s infinite ease-in-out;
}
</style>
