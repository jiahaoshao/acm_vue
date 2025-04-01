<template>
  <div id="home">
    <!-- 顶部导航栏 -->
    <div class="topbar">
      <nav>
        <ul class="left-nav">
          <li><router-link to="/home/home2">首页</router-link></li>
          <li><a href="#/ai" target="'_blank'">AI中心</a></li>
        </ul>

        <!-- 右侧导航栏 -->
        <ul class="right-nav">
          <li>
            <el-dropdown
              trigger="hover"
              class="el-tooltip__trigger"
              style="cursor: pointer"
            >
              <span>
                <el-avatar
                  shape="circle"
                  :size="50"
                  :src="imageBase64"
                  @click="goToSpace(user.uid)"
                  class="avatar"
                  style="cursor: pointer; "
                ></el-avatar>
              </span>

              <template #dropdown>
                <el-dropdown-menu class="custom-dropdown-menu">
                  <el-dropdown-item
                    icon="UserFilled"
                    @click="goToInfo"
                    class="dropdown-item"
                    >个人中心</el-dropdown-item
                  >
                  <el-dropdown-item
                    icon="Reading"
                    @click="goToAbout"
                    class="dropdown-item"
                    >关于我们</el-dropdown-item
                  >
                  <el-dropdown-item
                    icon="SwitchButton"
                    @click="signout"
                    class="dropdown-item"
                    divided
                    >退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </li>
          <li>
            <el-button
              @click="goToDraft"
              class="draftbox-button"
              icon="Message"
              >草稿箱</el-button
            >
          </li>
        </ul>
      </nav>
    </div>
    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="editor-header">
        <!-- 标题输入框 -->
        <div class="input-group">
          <span class="label">标题:</span>
          <el-input v-model="article.title" placeholder="请输入标题"></el-input>
        </div>
        <!-- 分区选择框 -->
        <div class="input-group">
          <span class="label">分区:</span>
          <el-select v-model="article.classify" placeholder="请选择分区">
            <el-option label="游戏" value="game"></el-option>
            <el-option label="电影" value="movie"></el-option>
            <el-option label="技术" value="tech"></el-option>
            <!-- 添加更多分区 -->
          </el-select>
        </div>
        <!-- 标签输入框 -->
        <div class="input-group">
          <span class="label">标签:</span>
          <el-input
            v-model="newTag"
            placeholder="按回车键Enter创建标签"
            @keydown.enter.prevent="handleTagKeydown"
          ></el-input>
          <!-- <p class="tag-last-wrp">还可以添加{{10 - article.value.tags.length}}个标签</p> -->
        </div>
        <div class="tag-pre-wrp">
          <el-tag
            v-for="(tag, index) in article.tags"
            :key="index"
            closable
            @close="removeTag(index)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      <!-- 富文本编辑器 -->
      <QuillEditor v-model="article.content"  />
      <div class="button-container">
        <el-button class="release-button" @click="Release">发布</el-button>
        <el-button class="draft-button" @click="Draft">存草稿</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref, reactive, watch, toRaw } from "vue";
import config from "@/../public/static/config.json";
import { ElLoading, ElMessage } from "element-plus";
import { useStore } from "vuex";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import QuillEditor from '@/components/QuillEditor.vue';

const aid = ref();
const router = useRouter();
const store = useStore();
const image_url = config.image_url;
const globalProperties =
  getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $api = globalProperties.$api;
const article = ref({
      aid: -1,
      title: "",
      content: "",
      authorId: 0,
      create_time: null,
      classify: null,
      tags: [],
      status: "创作中",
    });

const user = ref({});
const newTag = ref(""); // 用于存储新标签的输入值
const image = ref("");
const imageBase64 = ref("");
const shouldConfirm = ref(true); // 添加标志位，初始值为 true

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    imageBase64.value = user.value.avatar;
  }
  //localStorage.removeItem("article");
  const storedArticle = localStorage.getItem("article");
  if(storedArticle != "null" && storedArticle) {
    article.value = JSON.parse(storedArticle);
  } else {
    article.value.authorId = user.value.uid;
  }

  aid.value = router.currentRoute.value.query.aid;
  
  if(aid.value) {
    $api.articleApi.getArticleByAid({
      aid : aid.value
    }).then((res) => {
      article.value = res.data.data;
      article.value.tags = JSON.parse(res.data.data.tags);
     // console.log(article.value);
    });
  }

  store.commit("setArticle", article.value);

  const storedAvatar = localStorage.getItem("avatar");
  if (storedAvatar) {
    imageBase64.value = storedAvatar;
  }

  // 添加页面关闭提示
  window.addEventListener('beforeunload', handleBeforeUnload);
});

const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = '';
};

onBeforeRouteLeave((to, from, next) => {
  if (shouldConfirm.value) {
    const answer = window.confirm('您有未保存的更改，是否要保存？');
    if (answer) {
      // 调用保存函数
      saveArticle();
      next(); // 继续导航
    } else {
      next(false); // 取消导航
    }
  } else {
    next(); // 继续导航
  }
});

const goToInfo = () => {
  router.push("/home/info");
};

const goToSpace = (uid) => {
  router.push(`/space/${uid}`);
};


const goToAbout = () => {
  router.push("/home/about");
};

const signout = () => {
  store.commit("signout");
  location.reload();
};

const goToDraft = () => {
  router.push("/draftbox");
};

const handleUploadImage = (event, insertImage, file) => {
  // 启动加载动画
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '正在上传图片...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  $api.articleApi
    .uploadArticleImages({
      file: file[0],
      filepath: "images/article/",
    })
    .then((res) => {
      // 关闭加载动画
      loadingInstance.close();

      if (res.data.code !== 0) {
        ElMessage.error(res.data.message);
        return;
      }
      const imageUrl = res.data.data; // 假设返回的数据包含图片URL
      insertImage({
        url: imageUrl,
        desc: file[0].name,
        width: "300",
        height: "auto",
      });
    })
    .catch((error) => {
      // 出现错误时也需要关闭加载动画
      loadingInstance.close();
      //console.error("上传图片失败", error);
      ElMessage.error("上传图片失败");
    });
};

// 处理标签输入
const handleTagKeydown = () => {
  const tag = newTag.value.trim();
  if (
    tag &&
    !article.value.tags.includes(tag) &&
    article.value.tags.length < 10
  ) {
    article.value.tags.push(tag);
    newTag.value = "";
  }

  if (article.value.tags.length >= 10 && tag) {
    ElMessage.error("Σ( ° △ °|||)允许添加的标签已经达到上限了");
    newTag.value = "";
  }
};
// 移除标签
const removeTag = (index) => {
  article.value.tags.splice(index, 1);
};

const saveArticle = (text, html) => {
  //console.log(article.value);
  store.commit("setArticle", article.value);
  ElMessage.success("保存成功");
  //getArticle();
};

const getArticle = () => {
  const articleString = localStorage.getItem("article");
  if (articleString) {
    article.value = JSON.parse(articleString); // 将 JSON 字符串转换回对象
    //console.log(article.value);
  } else {
    console.log("No article found in localStorage.");
  }
};

const Release = () => {
  shouldConfirm.value = false; // 在点击发布按钮时，设置标志位为 false
  store.commit("setArticle", article.value);
  getArticle();

  if(!article.value.title) {
    ElMessage.error("标题不能为空");
    return;
  }
  if(!article.value.classify) {
    ElMessage.error("请选择分区");
    return;
  }
  if(article.value.tags.length === 0) {
    ElMessage.error("请添加标签");
    return;
  }
  if(!article.value.content) {
    ElMessage.error("正文内容不能为空");
    return;
  }

  $api.articleApi
    .updateArticle({
      aid: article.value.aid,
      title: article.value.title,
      content: article.value.content,
      authorId: user.value.uid,
      create_time: null,
      classify: article.value.classify,
      tags: article.value.tags,
      status: "已发布",
    })
    .then((res) => {
      console.log(res);
      localStorage.removeItem("article");
      ElMessage.success("发布成功");
      router.back();
    });
};

const Draft = () => {
  shouldConfirm.value = false; // 在点击发布按钮时，设置标志位为 false
  saveArticle();
  getArticle();
  $api.articleApi
    .updateArticle({
      aid: article.value.aid,
      title: article.value.title,
      content: article.value.content,
      authorId: user.value.uid,
      create_time: null,
      classify: article.value.classify,
      tags: article.value.tags,
      status: "草稿",
    })
    .then((res) => {
      console.log(res);
      localStorage.removeItem("article");
      ElMessage.success("保存成功");
      router.back();
    });
};
</script>

<style scoped>
#home {
  display: flex;
  flex-direction: column; /* 主容器垂直布局 */
  height: 80vh;
}

.topbar {
  width: 100%;
  background-color: white;
  color: white;
  padding: 0px 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.topbar nav {
  display: flex;
  justify-content: space-between; /* 左右分布 */
  align-items: center; /* 垂直居中 */
}

.left-nav,
.right-nav {
  list-style: none;
  display: flex;
  padding: 0;
}

.left-nav li,
.right-nav li {
  margin: 0 20px;
  display: flex; /* 使用 flex 布局 */
  align-items: center; /* 垂直居中 */
}

.left-nav li a,
.right-nav li a,
.auth-button {
  color: black;
  text-decoration: none;
  font-size: 18px;
  display: block;
  padding: 10px 15px;
  border-radius: 5px;
}

.left-nav li a:hover,
.right-nav li a:hover,
.auth-button:hover {
  animation: text-jump 0.5s alternate;
}

/* 右侧导航项自动推到右边 */
.right-nav {
  margin-left: auto;
}

.main-content {
  flex-grow: 1;
  padding: 100px;
  background-color: #f4f6f9;
}

/* 保证下拉框内容的显示与交互 */
.el-dropdown__wrapper {
  display: inline-block;
  position: relative;
}
/* 头像的悬停效果 */
.el-avatar {
  transition: transform 0.3s ease; /* 头像变大的过渡动画 */
}
/* 头像悬停时放大 */
.el-avatar:hover {
  transform: scale(1.4); /* 放大头像 */
}
/* 当下拉框悬停时保持头像放大 */
.el-dropdown__wrapper:hover .el-avatar {
  transform: scale(1.4); /* 在下拉框悬停时，头像保持放大 */
}

.button-container {
  display: flex;
  justify-content: center; /* 居中对齐 */
  gap: 20px; /* 按钮间距 */
  margin-top: 20px;
}
.draftbox-button {
  color: white;
  text-decoration: none;
  font-size: 18px;
  display: flex; /* 使用 flex 布局 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 水平居中对齐 */
  padding: 20px 15px;
  border-radius: 5px;
  background-color: #ef632b;
  border: none;
  cursor: pointer;
}

.draftbox-button:hover {
  background-color: #f97d1c;
  color: white; /* 保持字体颜色不变 */
}

.release-button {
  color: white;
  text-decoration: none;
  font-size: 18px;
  display: flex; /* 使用 flex 布局 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 水平居中对齐 */
  padding: 25px 30px;
  border-radius: 5px;
  background-color: #ef632b;
  border: none;
  cursor: pointer;
}

.release-button:hover {
  background-color: #f97d1c;
  color: white; /* 保持字体颜色不变 */
}

.draft-button {
  color: black;
  text-decoration: none;
  font-size: 18px;
  display: flex; /* 使用 flex 布局 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 水平居中对齐 */
  padding: 25px 30px;
  border-radius: 5px;
  background-color: white;
  border: none;
  cursor: pointer;
}

.draft-button:hover {
  background-color: white;
  color: black; /* 保持字体颜色不变 */
}

/* 定义文字跃动的关键帧 */
@keyframes text-jump {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -5px);
  }
  100% {
    transform: translate(0, 0);
  }
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.custom-dropdown-menu {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  min-width: 250px; /* 确保下拉框有足够的宽度 */
  min-height: 110px; /* 给下拉框设置一个最小高度，确保菜单项显示 */
  padding: 20px;
  background-color: #f4f6f9; /* 淡灰色背景 */
  border-radius: 5px; /* 圆角边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
  font-size: 18px;
}
.login-dropdown-menu {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  min-width: 250px; /* 确保下拉框有足够的宽度 */
  min-height: 200px; /* 给下拉框设置一个最小高度，确保菜单项显示 */
  padding: 20px;
  background-color: #f4f6f9; /* 淡灰色背景 */
  border-radius: 5px; /* 圆角边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
  text-align: center;
  font-size: 16px;
}
.login-message {
  margin-bottom: 10px;
  font-weight: bold; /* 粗体显示 */
}
.benefits-list {
  list-style: none; /* 去掉列表样式 */
  padding: 0;
  margin: 0;
}
.benefits-list li {
  margin: 5px 0;
}
.login-button {
  margin: 10px 0;
  width: 100%; /* 宽度占满 */
  text-align: center; /* 文本居中 */
  font-size: 18px;
}
.signup-message {
  margin-top: 10px;
  text-align: center; /* 文字居中 */
  font-weight: bold; /* 粗体显示 */
}
.signup-link {
  color: #3498db; /* 蓝色链接 */
  text-decoration: none; /* 去掉下划线 */
}
.signup-link:hover {
  text-decoration: underline; /* 悬停时显示下划线 */
}
.dropdown-item {
  font-size: 18px;
}
.editor-header {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  gap: 10px;
  margin-bottom: 20px;

}
.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center; /* 水平居中 */
}
.label {
  min-width: 60px; /* 标签文字最小宽度 */
  text-align: right;
}
.el-input,
.el-select {
  flex: 0.2; /* 全宽 */
  flex-wrap: wrap;
}
.tag-pre-wrp {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
}
.tag-input {
  flex: 1;
}
.tag-last-wrp {
  margin-top: 10px;
  color: #888;
}

/* 新增占位元素样式 */
.spacer {
  flex-grow: 1;
}

.ql-container {
	height: calc(100% - 42px);
}

.ql-editor {
  height: 500px;
}
</style>