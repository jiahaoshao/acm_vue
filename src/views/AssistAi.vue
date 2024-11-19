<template>
  <div class="home">
    <el-container>
      <el-header>
        <h2 class="title">AI创新天地</h2>
      </el-header>
      <el-main class="function">
        <nav>
          <ul>
            <li><router-link to="/home/ai">聊天助手</router-link></li>
            <li><router-link to="/home/musicAi">音乐助手</router-link></li>
            <li><router-link to="/home/artAi">绘画助手</router-link></li> 
          </ul>
        </nav>
      </el-main>
      <el-footer>
        <!-- 聊天框和历史记录区域并排 -->
        <div class="chat-wrapper">
          <!-- 聊天框 -->
          <div class="chat-box">
            <el-scrollbar class="chat-container">
              <div v-for="(msg, index) in conversation" :key="index" :class="['message', msg.isUser ? 'user' : 'ai']">
                <p>{{ msg.text }}</p>
              </div>
            </el-scrollbar>
            <el-input
              v-model="userInput"
              placeholder="请输入你的问题..."
              @keyup.enter="submitQuestion"
              clearable
              class="input-box"
            />
            <el-button @click="submitQuestion" type="primary" class="submit-btn">提交</el-button>
          </div>

          <!-- 历史记录部分 -->
          <div class="history-box">
            <h3>历史记录</h3>
            <ul>
              <li v-for="(msg, index) in conversation.slice().reverse()" :key="index">
                <div :class="['message', msg.isUser ? 'user' : 'ai']">
                  <p>{{ msg.text }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, nextTick } from 'vue';

export default {
  name: 'Ai',
  setup() {
    const userInput = ref('');
    const conversation = ref([]);

    // 提交问题
    const submitQuestion = async () => {
      if (!userInput.value.trim()) return;

      // 用户提问，加入对话
      conversation.value.push({ text: userInput.value, isUser: true });
      const question = userInput.value;
      userInput.value = '';  // 清空输入框

      try {
        // 假设后端接口是 /get_answer
        const response = await axios.post('http://localhost:5000/get_answer', { question });

        // 获取AI的回答并加入对话
        conversation.value.push({ text: response.data.answer, isUser: false });

        // 等待 DOM 更新后滚动到底部
        nextTick(() => {
          const chatContainer = document.querySelector('.chat-container');
          chatContainer.scrollTop = chatContainer.scrollHeight;
        });
      } catch (error) {
        console.error('Error:', error);
        conversation.value.push({ text: '发生错误，请稍后再试。', isUser: false });
      }
    };

    return {
      userInput,
      conversation,
      submitQuestion
    };
  }
};
</script>

<style scoped lang="less">
.home {
  height: 100%;
  margin-top: 0;
}

:deep(.el-header) {
  height: 50px; /* 缩小标题区域的高度 */
  background-color: #2c3e50;
  color: white;
  padding-bottom: 5px;
}

.title {
  margin-left: 20px; /* 缩小标题的左边距，使其更靠近左侧 */
  font-size: 22px; /* 减小字体大小 */
  padding-bottom: 5px;
  margin-bottom: 0;
  text-align: center;
}

.function {
  background-color: #2c3e50;
  padding: 0;
  margin: 0;
}

.function ul {
  display: flex;
  padding: 0;
  margin: 0;
}

.function li {
  margin-left: 30px; /* 缩小导航项的间距 */
  font-size: 24px; /* 减小字体大小 */
  list-style: none;
}

.function a {
  text-decoration: none;
  color: white;
}

.function a:hover {
  background-color: #34495e;
}

.router-link-active {
  background-color: #42b983;
  color: white;
  border-radius: 5px;
}

/* 聊天框和历史记录部分的容器 */
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
  width: 100%; /* 聊天框占 70% 宽度 */
  max-width: 800px; 
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding:20px;
  display: flex;
  flex-direction: column;
  height: 600px; /* 增加聊天框的高度 */

}

.chat-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  width: 100%;
}

.message {
  padding: 10px 20px;
  margin: 8px 0;
  border-radius: 10px;
  width: 100%;
  word-wrap: break-word;
}

.user {
  background-color: #e0f7fa;
  align-self: flex-end;
}

.ai {
  background-color: #f1f1f1;
  align-self: flex-start;
}

.input-box {
  width: 800px; /* 输入框宽度填满聊天框 */
  margin-bottom: 10px;
  margin-left:20px
}

.submit-btn {
  width: 20%; /* 提交按钮宽度 */
  background-color: #42b983;
  color: white;
}

.submit-btn:hover {
  background-color: #367f5b;
}

/* 历史记录部分 */
.history-box {
  background-color: #f9f9f9;
  width: 28%; /* 历史记录框占 28% 宽度 */
  max-height: 600px; /* 设置最大高度 */
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

.history-box .message {
  margin: 5px 0;
}
</style>
