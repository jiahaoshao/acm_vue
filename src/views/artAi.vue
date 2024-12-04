<template>
  <div class="drawing-assistant">
    <el-container>
      <el-footer>
        <div class="drawing-wrapper">
          <!-- 输入框和提交按钮区域 -->
          <div class="input-box-wrapper">
            <el-input
              v-model="userInput.prompt"
              placeholder="想要的元素..."
              @keyup.enter="submitDrawing"
              clearable
              class="input-box"
            />
            <el-input
              v-model="userInput.negative_prompt"
              placeholder="不想要的元素..."
              clearable
              class="input-box"
            />
            <el-input
              v-model="userInput.step"
              placeholder="迭代次数"
              clearable
              class="input-box"
            />
            <el-input
              v-model="userInput.n"
              placeholder="生成张数"
              clearable
              class="input-box"
            />
            <el-button @click="submitDrawing" type="primary" class="submit-btn">
              提交
            </el-button>
          </div>

          <!-- 尺寸选择 -->
          <div class="extra-options">
            <el-select v-model="userInput.size" placeholder="选择图像尺寸" class="input-box">
              <el-option label="1024x1024" value="1024x1024" />
              <el-option label="512x512" value="512x512" />
              <el-option label="256x256" value="256x256" />
            </el-select>
          </div>

          <!-- 显示生成的图像 -->
            <!-- 显示生成的图像 -->
          <div v-if="images.length > 0" class="image-container">
            <div v-for="(img, index) in images" :key="index">
              <img :src="img" alt="生成的图像" class="generated-image" :style="imageStyle" />
            </div>
          </div>

          <!-- 提示信息 -->
          <div v-if="loading" class="loading-message">正在生成图像，请稍候...</div>
          <div v-if="error" class="error-message">发生错误，请稍后再试。</div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, nextTick, getCurrentInstance, watch, onMounted } from "vue";

// 获取全局挂载的 $api 对象
const globalProperties = getCurrentInstance().appContext.config.globalProperties;
const $api = globalProperties.$api;

const userInput = ref({
  prompt: "",           // 用户输入的文本描述
  negative_prompt: "",  // 用户输入的负面提示（不想要的元素）
  size: "1024x1024", 
  step:""   ,          //迭代次数
  n:""
});

const images = ref([]);  // 改为数组来存储多张图像
const image = ref();
const loading = ref(false); // 控制加载状态
const error = ref(false);   // 控制错误状态
const access_token = ref("");  // 存储 access_token

// 存储图像的尺寸
const imageStyle = ref({
  width: "1024px",  // 默认 1024x1024
  height: "1024px", // 默认 1024x1024
});

// 监听尺寸变化，更新图像的宽高
watch(() => userInput.value.size, (newSize) => {
  const [width, height] = newSize.split('x');
  imageStyle.value = { width: `${width}px`, height: `${height}px` };
});

// 提交生成图像请求

onMounted(() => {
  const storedAccessToken = localStorage.getItem("access_token");
  if (storedAccessToken) {
    get_access_token();
    access_token.value = storedAccessToken;
  } else {
    get_access_token();
  }
});

const get_access_token = () =>{
  $api.AiApi.get_access_token()
  .then((res) => {
    console.log(res);
    access_token.value = res.data.access_token;
    localStorage.setItem("access_token", res.data.access_token);
  })
  
}

const submitDrawing = async () => {
  if (!userInput.value.prompt.trim()) return; // 确保用户输入了内容
  if (userInput.value.step && isNaN(userInput.value.step)) {   //检查 step 是否为有效数字
    return;
  }
  loading.value = true;  // 开始加载状态
  error.value = false;   // 清除之前的错误信息

  const { prompt, negative_prompt, size, step, n } = userInput.value;
  try {

    // 调用绘画接口
    const response = await $api.AiApi.art({
      access_token: access_token.value,
      prompt: prompt,
      negative_prompt: negative_prompt,  // 添加负面提示
      size: size,                        // 添加尺寸选项
      steps: step,                        // 迭代次数
      n: n,                               // 生成张数
      sampler_index: "DPM++ SDE Karras",
    });

    const data = response.data.data;
    console.log(data)
    images.value = data.map(item => 'data:image/png;base64,' + item.b64_image); // 保存多张图像
  } catch (err) {
    console.error("Error:", err);
    error.value = true;  // 出现错误时设置错误状态
  } finally {
    loading.value = false;  // 请求完成，取消加载状态
    nextTick(() => {
      const chatContainer = document.querySelector(".drawing-wrapper");
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  }
};

</script>

<style scoped lang="less">
.drawing-assistant {
  height: 100%;
  margin-top: 0;
  background-color: #f0f2f5; /* 设置背景色 */
}

.drawing-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
  margin: 20px auto;
  background: white;
  padding: 30px;
  border-radius: 12px;  /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);  /* 阴影效果 */
}

.input-box-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  max-width: 800px;
}

.input-box {
  flex: 1;
  margin-right: 10px;
  width: 200px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  background-color: #f7f7f7;
  transition: border-color 0.3s ease;
}

.input-box:focus {
  border-color: #42b983;
}

.submit-btn {
  background-color: #42b983;
  color: white;
  width: 100px;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #367f5b;
}

.extra-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 20px;
}

.extra-options .input-box {
  width: 350px;
  max-width: 600px;
  margin-bottom: 10px;
}

.image-container {
  margin-top: 20px;
  text-align: center;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.generated-image {
  width: 100%;
  height: auto;
  border-radius: 8px; /* 给图像加圆角 */
}

.loading-message {
  margin-top: 20px;
  font-size: 16px;
  color: #42b983;
}

.error-message {
  margin-top: 20px;
  font-size: 16px;
  color: red;
}

@media (max-width: 768px) {
  .input-box-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .input-box {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .submit-btn {
    margin-top: 10px;
  }
}
</style>
