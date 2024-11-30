<template>
  <div class="about">
    <div>
      <v-md-preview :text="contentA"></v-md-preview>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const contentA = ref("1234567");
const readText = () => {
  // 请求的是我自己的接口地址，后端代码逻辑就是存到数据库中的一个text文件，然后下面完整的代码中，我提供了我的markdown文本
  fetch("http://robin.com/Article/18")
    .then((response) => response.text())
    .then((data) => {
      contentA.value = JSON.parse(data).content;
      //console.log(contentA.value)
    })
    .catch((error) => console.error("Error:", error));
};
//readText();
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    min-width: 1024px;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }
}
</style>
