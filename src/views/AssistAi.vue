<template>
  <div class="home">
    <el-container>
      <el-footer>
        <!-- 聊天框和历史记录区域并排 -->
        <div class="chat-wrapper">
          <!-- 聊天框 -->
          <div class="chat-box">
            <el-scrollbar class="chat-container" ref="scrollbarRef">
              <div 
                ref="innerRef"
                v-for="(msg, index) in messages"
                :key="index"
                :class="['message', msg.role === 'user' ? 'user' : 'system']"
              >
                <div class="avatar">
                  <el-avatar :src="msg.role === 'user' ? imageBase64 : require('@/assets/ai.png')" alt="avatar" />
                </div>
                <div class="message-content">
                  <p v-html="isFirstSystemMessage(index, msg.role) ? '你好,我是你的聊天助手' : md.render(msg.content)"></p>
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
                v-for="(chat) in Chats"
                :key="chat.chatid"
                @click="loadChat(chat)"
                :class="{ 'selected': chat.chatid === chatid }"
              >
                  <div class="chat-content">
                    <p v-html="chat.messages[1].content"></p>
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
import { nextTick, getCurrentInstance, onMounted, ref, computed } from "vue";
import myJson from "@/../public/static/config.json";

const { image_url , system_content } = myJson;
const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $api = globalProperties.$api;

const user = ref();
const userInput = ref("");
const messages = ref([
  { role: "system", content: system_content }
]);
const md = new MarkdownIt();
const imageBase64 = ref("");

const scrollbarRef = ref(null);

const chatid = ref();
const Chats = ref();
const reversedMessages = computed(() => {
  return [...messages.value].reverse();
});

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    imageBase64.value = user.value.avatar;
  }
  getChats(true);
  scrollToBottom();
});

const getChats = (isfirst) => {
  $api.AiApi.getchats({
      uid: user.value.uid,
  }).then((res) => {
      console.log(res);
      Chats.value = res.data;
      if (Chats.value.length > 0) {
          if(isfirst){
            chatid.value = Chats.value.length + 1;
          }
          console.log(chatid.value);
      }
  });
}


// 加载历史聊天记录
const loadChat = (chat) => {
  messages.value = chat.messages;
  chatid.value = chat.chatid;
  nextTick(() => {
    scrollToBottom();
  });
};

// 判断是否为第一个 system 消息
const isFirstSystemMessage = (index, role) => {
  if (role !== 'system') return false;
  for (let i = 0; i < index; i++) {
    if (messages.value[i].role === 'system') {
      return false;
    }
  }
  return true;
};


// 提交问题
const submitQuestion = async () => {
  if (!userInput.value.trim()) return;

  // 用户提问，加入消息
  messages.value.push({ role: "user", content: userInput.value });
  //const question = userInput.value;
  userInput.value = ""; // 清空输入框

  // 等待 DOM 更新后滚动到底部
  nextTick(() => {
    scrollToBottom();
  });

  try {
    //console.log(messages.value);
    // 调用接口，传递完整的 messages 数组
    const response = await $api.AiApi.chat({
      uid: user.value.uid,
      chatid: chatid.value,
      messages: messages.value
    });
    console.log(response);

    // 获取AI的回答并加入消息
    const aiContent = response.data.choices[0].message.content;
    messages.value.push({ role: "system", content: aiContent });
    
    getChats(false);
    
    // 等待 DOM 更新后滚动到底部
    nextTick(() => {
      scrollToBottom();
    });

  } catch (error) {
    console.error("Error:", error);
    messages.value.push({ role: "system", content: "发生错误，请稍后再试。" });
  }
};

// 滚动面板自动滑动到底部
const scrollToBottom = () => {
  if (scrollbarRef.value) {
    const container = scrollbarRef.value.$el.querySelector('.el-scrollbar__wrap');
    container.style.scrollBehavior = 'smooth'; // 添加平滑滚动效果
    container.scrollTop = container.scrollHeight;
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

.chat-content {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin: 5px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
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
  order: 1; /* 头像位于右侧 */
}
.user .message-content {
  background-color: #e0f7fa;
  margin-left: auto;
}

.system {
  justify-content: flex-start;
  text-align: left;
}
.system .message-content {
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

/* 高亮选中的历史记录项 */
.selected div{
  background-color: #e0f7fa;
  border: 1px solid #42b983;
}
</style>