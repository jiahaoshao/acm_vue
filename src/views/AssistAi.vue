<template>
  <div class="home">
    <el-container>
      <el-footer>
        <!-- 聊天框和历史记录区域并排 -->
        <div class="chat-wrapper">
          <!-- 聊天框 -->
          <div class="chat-box">
            <el-scrollbar class="chat-container">
              <div 
                v-for="(msg, index) in conversation"
                :key="index"
                :class="['message', msg.isUser ? 'user' : 'ai']"
              >
                <div class="avatar">
                  <el-avatar :src="msg.isUser ? image : require('@/assets/ai.png')" alt="avatar" />
                </div>
                <div class="message-content">
                  <p v-html="msg.text"></p>
                </div>
              </div>
            </el-scrollbar>
            <el-input
              v-model="userInput"
              placeholder="请输入你的问题..."
              @keyup.enter="submitQuestion"
              clearable
              class="input-box"
            />
            <el-button @click="submitQuestion" type="primary" class="submit-btn">
              提交
            </el-button>
          </div>

          <!-- 历史记录部分 -->
          <div class="history-box">
            <h3>历史记录</h3>
            <ul>
              <li
                v-for="(msg, index) in conversation.slice().reverse()"
                :key="index"
              >
                <div :class="['message', msg.isUser ? 'user' : 'ai']">
                  <div class="avatar">
                    <el-avatar :src="msg.isUser ? image : require('@/assets/ai.png')" alt="avatar" />
                  </div>
                  <div class="message-content">
                    <p v-html="msg.text"></p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import MarkdownIt from "markdown-it";
import 'github-markdown-css';
import {  nextTick, getCurrentInstance } from "vue";
import { onMounted, ref } from "vue";
import myJson from "@/../public/static/config.json";
const { image_url } = myJson;
const user = ref({});
const image = ref("");
const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $api = globalProperties.$api
const userInput = ref("");
const conversation = ref([]);
const md = new MarkdownIt();

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(localStorage.getItem("user"));
    image.value = image_url + user.value.avatar;
  }
});
// 提交问题
const submitQuestion = async () => {
  if (!userInput.value.trim()) return;

  // 用户提问，加入对话
  conversation.value.push({ text: md.render(userInput.value), isUser: true });
  const question = userInput.value;
  userInput.value = ""; // 清空输入框

  try {
    // 假设后端接口是 /get_answer
    const response = await $api.AiApi.chat(question)
    console.log(response)

    // 获取AI的回答并加入对话
    conversation.value.push({ text: md.render(response.data.choices[0].message.content), isUser: false });

    // 等待 DOM 更新后滚动到底部
    nextTick(() => {
      const chatContainer = document.querySelector(".chat-container");
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  } catch (error) {
    console.error("Error:", error);
    conversation.value.push({ text: "发生错误，请稍后再试。", isUser: false });
  }
};
</script>

<style scoped lang="less">
.home {
  height: 100%;
  margin-top: 0;
}

.chat-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
}

/* 聊天框部分 */
.chat-box {
  background-color: white;
  width: 100%; 
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 600px; 
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  width: 100%;
}

.message {
  display: flex;
  align-items: flex-start;
  margin: 8px 0;
}

.message .avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.message .avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.message-content {
  max-width: 70%;
  word-wrap: break-word;
  padding: 10px 20px;
  border-radius: 10px;
  width: fit-content;
}

.user {
  justify-content: flex-end;
  text-align: right;
}
.user .avatar {
  order: 1;                    /* 头像位于右侧 */
}

.user .message-content {
  background-color: #e0f7fa;
  margin-left: auto;
}

.ai {
  justify-content: flex-start;
  text-align: left;
}

.ai .message-content {
  background-color: #f1f1f1;
}

.input-box {
  width: 100%;
  margin-bottom: 10px;
  margin-left: 20px;
}

.submit-btn {
  width: 20%;
  background-color: #42b983;
  color: white;
}

.submit-btn:hover {
  background-color: #367f5b;
}

/* 历史记录部分 */
.history-box {
  background-color: #f9f9f9;
  width: 28%; 
  max-height: 600px;
  overflow-y: auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.history-box h3 {
  margin-bottom: 15px;
  text-align: center;
  font-size: 20px;
  color: #333;
}

.history-box ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.history-box li {
  margin-bottom: 10px;
}
</style>
