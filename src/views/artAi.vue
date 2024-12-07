<template>
  <div>
    <el-container>
      <el-main>
        <div class="drawing-wrapper">
          <!-- 输入框和提交按钮区域（左侧） -->
          <div class="input-box-wrapper">

            <!-- 风格选择下拉框 -->
            <label for="style-select">选择风格：</label>
            <el-select id="style-select" v-model="userInput.style" placeholder="选择风格" class="input-box">
              <el-option label="基础风格" value="Base" />
              <el-option label="3D模型" value="3D Model" />
              <el-option label="模拟胶片" value="Analog Film" />
              <el-option label="动漫" value="Anime" />
              <el-option label="电影" value="Cinematic" />
              <el-option label="漫画" value="Comic Book" />
              <el-option label="工艺黏土" value="Craft Clay" />
              <el-option label="数字艺术" value="Digital Art" />
              <el-option label="增强" value="Enhance" />
              <el-option label="幻想艺术" value="Fantasy Art" />
              <el-option label="等距风格" value="Isometric" />
              <el-option label="线条艺术" value="Line Art" />
              <el-option label="低多边形" value="Lowpoly" />
              <el-option label="霓虹朋克" value="Neonpunk" />
              <el-option label="折纸" value="Origami" />
              <el-option label="摄影" value="Photographic" />
              <el-option label="像素艺术" value="Pixel Art" />
              <el-option label="纹理" value="Texture" />
            </el-select>

            <label for="prompt-input">想要的元素描述：</label>
            <el-input
              id="prompt-input"
              v-model="userInput.prompt"
              @keyup.enter="submitDrawing"
              clearable
              class="input-box"
              maxlength="1024"
              show-word-limit
            />
            <label for="negative-prompt-input">不想要的元素描述：</label>
            <el-input
              id="negative-prompt-input"
              v-model="userInput.negative_prompt"
              clearable
              class="input-box"
              maxlength="1024"
              show-word-limit
            />
            <label for="step-input">迭代次数：</label>
            <el-input-number
              id="step-input"
              v-model="userInput.step"
              :min="10"
              :max="50"
              placeholder="迭代次数 (10-50)"
              class="input-box"
            />
            <label for="n-input">生成张数：</label>
            <el-input-number
              id="n-input"
              v-model="userInput.n"
              :min="1"
              :max="4"
              placeholder="生成张数 (1-4)"
              class="input-box"
            />

            <label for="size-select">选择图像尺寸：</label>
            <el-select id="size-select" v-model="userInput.size" placeholder="选择图像尺寸" class="input-box">
              <el-option label="2048x2048" value="2048x2048" />
              <el-option label="2048x1536" value="2048x1536" />
              <el-option label="2048x1152" value="2048x1152" />
              <el-option label="1536x2048" value="1536x2048" />
              <el-option label="1536x1536" value="1536x1536" />
              <el-option label="1152x2048" value="1152x2048" />
              <el-option label="1024x1024" value="1024x1024" />
              <el-option label="1024x768" value="1024x768" />
              <el-option label="1024x576" value="1024x576" />
              <el-option label="768x1024" value="768x1024" />
              <el-option label="768x768" value="768x768" />
              <el-option label="576x1024" value="576x1024" />
            </el-select>
            <el-button @click="submitDrawing" type="primary" class="submit-btn">
              提交
            </el-button>
          </div>

          <!-- 显示生成的图像（右侧） -->
          <div class="image-display">
            <div v-if="loading" class="loading-message">正在生成图像，请稍候...</div>
            <div v-if="error" class="error-message">发生错误，请稍后再试。</div>
            <div v-if="images.length > 0" class="image-container">
              <div v-for="(img, index) in images" :key="index" class="image-item">
                <img :src="img" alt="生成的图像" class="generated-image"/>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref, nextTick, getCurrentInstance, watch, onMounted } from "vue";

// 获取全局挂载的 $api 对象
const globalProperties = getCurrentInstance().appContext.config.globalProperties;
const $api = globalProperties.$api;

const userInput = ref({
  prompt: "",           // 用户输入的文本描述
  negative_prompt: "",  // 用户输入的负面提示（不想要的元素）
  size: "1024x1024", 
  step:""   ,          //迭代次数
  n:"",
  style: "Base",        // 风格选择
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
  // const storedAccessToken = localStorage.getItem("access_token");
  // if (storedAccessToken) {
  //   //get_access_token();
  //   access_token.value = storedAccessToken;
  // } else {
  //   get_access_token();
  // }
});

// const get_access_token = () =>{
//   $api.AiApi.get_access_token()
//   .then((res) => {
//     //console.log(res);
//     access_token.value = res.data.access_token;
//     localStorage.setItem("access_token", res.data.access_token);
//   })
//   .catch((err) => {
//       console.error("获取访问令牌失败:", err);
//       ElMessage.error("获取访问令牌失败");
//   });
// }

const submitDrawing = async () => {
  if (!userInput.value.prompt.trim()) {
    ElMessage.error("请输入想要的元素描述");
    return; // 确保用户输入了内容
  }

  loading.value = true;  // 开始加载状态
  error.value = false;   // 清除之前的错误信息

  const { prompt, negative_prompt, size, step, n, style } = userInput.value;
  try {

    // 调用绘画接口
    const response = await $api.AiApi.art({
      prompt: prompt,
      negative_prompt: negative_prompt,  // 添加负面提示
      size: size,                        // 添加尺寸选项
      steps: step,                        // 迭代次数
      n: n,                               // 生成张数
      style: style,                       // 添加风格选项
      sampler_index: "DPM++ SDE Karras",
    });

    const data = response.data.data;
    console.log(response)
    images.value = data.map(item => 'data:image/png;base64,' + item.b64_image); // 保存多张图像
  } catch (err) {
    console.error("Error:", err);
    error.value = true;  // 出现错误时设置错误状态
  } finally {
    loading.value = false;  // 请求完成，取消加载状态
    nextTick(() => {
      const chatContainer = document.querySelector(".image-display");
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  }
};
</script>

<style scoped lang="less">
.drawing-assistant {
  height: 100%;
  background-color: #f0f2f5; /* 设置背景色 */
}

.drawing-wrapper {
  display: flex;
  flex-direction: row;
  gap: 20px; /* 左右间距 */
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 12px;  /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);  /* 阴影效果 */
}

.input-box-wrapper {
  display: flex;
  flex-direction: column;
  width: 300px; /* 设置输入区域的宽度 */
  gap: 15px; /* 输入框之间的间距 */
}

.input-box {
  width: 100%;
}

.submit-btn {
  background-color: #42b983;
  color: white;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #367f5b;
}

.image-display {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}

.image-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;
}

.image-item {
  flex: 0 1 512px; /* 固定宽度为512px */
  max-width: 512px;
}

.generated-image {
  width: 512px;
  height: auto;
  object-fit: contain; /* 保持图片比例 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-message {
  margin-top: 20px;
  font-size: 16px;
  color: #42b983;
  text-align: center;
}

.error-message {
  margin-top: 20px;
  font-size: 16px;
  color: red;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .drawing-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .input-box-wrapper {
    width: 100%;
    max-width: 500px;
  }

  .image-item {
    flex: 0 1 512px; /* 保持图片宽度为512px */
    max-width: 512px;
  }
}

@media (max-width: 600px) {
  .image-item {
    flex: 0 1 512px; /* 保持图片宽度为512px */
    max-width: 512px;
  }
}
</style>
