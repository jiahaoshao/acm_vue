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
          <!-- 判断用户是否登录 -->

          <!-- 只有登录后才显示个人信息 -->
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
                  @click="goToSpace"
                  class="avatar"
                  style="cursor: pointer"
                  v-if="isLoggedIn"
                ></el-avatar>
                <el-avatar
                  shape="circle"
                  :size="50"
                  @click="goToLogin"
                  class="avatar"
                  style="cursor: pointer"
                  v-if="!isLoggedIn"
                  >登录</el-avatar
                >
              </span>

              <template #dropdown>
                <el-dropdown-menu
                  class="custom-dropdown-menu"
                  v-if="isLoggedIn"
                >
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
                <el-dropdown-menu
                  v-if="!isLoggedIn"
                  class="login-dropdown-menu"
                >
                  <div class="login-message">
                    <span>登录后你可以：</span>
                    <ul class="benefits-list">
                      <li>免 费 看 高 清 视 频</li>
                      <li>多 端 同 步 播 放 记 录</li>
                      <li>发 表 评 论 / 弹 幕</li>
                      <li>热 门 番 剧 影 视 看 不 停</li>
                    </ul>
                  </div>
                  <el-button
                    type="primary"
                    @click="goToLogin"
                    class="login-button"
                    >立即登录</el-button
                  >
                  <div class="signup-message">
                    <span>首次使用？</span>
                    <router-link to="/register" class="signup-link"
                      >点击注册</router-link
                    >
                  </div>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </li>
          <li>
            <el-button
              @click="goToRelease"
              class="release-button"
              icon="CirclePlusFilled"
              >发布</el-button
            >
          </li>
        </ul>
      </nav>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="article-container">
        <h1>{{ article.title }}</h1>
        <div class="article-info">
          <span>{{ article.create_time }}</span>
          <span>作者：{{ article.authorId }}</span>
          <span>分类：{{ article.classify }}</span>
          <el-tag v-for="(tag, index) in article.tags" :key="index">
            {{ tag }}
          </el-tag>
        </div>
        <div
          v-for="anchor in titles"
          :key="anchor.lineIndex"
          :style="{ padding: `10px 0 10px ${anchor.indent * 20}px` }"
          @click="handleAnchorClick(anchor)"
        >
          <a class="anchor-link" style="cursor: pointer">{{ anchor.title }}</a>
        </div>
        <v-md-preview
          :text="article.content"
          v-if="article.content"
          ref="preview"
        ></v-md-preview>
        <div v-else>内容加载中...</div>
      </div>
      <!-- 评论区 -->

      <div style="margin: 20px 0">
        <el-rate
          v-model="comment.rate"
          :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          :max="5"
          allow-half
          show-text
          :texts="['非常差', '失望至极', '一般般', '非常满意', 'surprise']"
        ></el-rate>
        <div style="margin: 10px 0">
          <el-input
            type="textarea"
            placeholder="请输入评论"
            v-model="comment.content"
          ></el-input>
          <div style="text-align: right; margin: 10px 0">
            <el-button type="primary" @click="submit">提交</el-button>
          </div>
        </div>

        <div style="margin: 20px 0">
          <div
            style="
              margin: 10px 0;
              font-size: 24px;
              padding: 10px 0;
              border-bottom: 1px solid #ccc;
              text-align: left;
            "
          >
            评论列表
          </div>
          <div style="margin: 20px 0; text-align: left" v-if="comments">
            <div
              style="padding: 10px 0; border-bottom: 1px solid #ccc"
              v-for="item in comments"
              :key="item.id"
            >
              <div style="display: flex">
                <div style="width: 80px">
                  <el-avatar
                    :size="45"
                    :src="item.user.avatar"
                    v-if="item.user"
                    @click="goToSpace(item.userId)"
                    style="cursor: pointer;"
                  ></el-avatar>
                </div>
                <div style="flex: 1">
                  <div style="color: black">
                    <b>{{ item.username }}：</b><span>{{ item.content }}</span>
                  </div>

                  <div style="width: 200px; margin-top: 15px">
                    <i class="el-icon-time"></i
                    ><span style="margin-left: 5px">{{ item.createTime }}</span>
                  </div>
                  <!--多级回复-->
                  <div>
                    <el-button
                      type="text"
                      @click="reply(item.id, item.username)"
                      >回复</el-button
                    >
                  </div>

                  <!--回复列表-->
                  <div
                    v-if="item.children.length"
                    style="
                      margin-left: 100px;
                      background-color: aliceblue;
                      padding: 10px;
                      border-radius: 10px;
                    "
                  >
                    <div v-for="sub in item.children" :key="sub.id">
                      <div style="display: flex">
                        <div>
                          <el-avatar
                            :size="30"
                            :src="sub.user.avatar"
                            v-if="sub.user"
                            @click="goToSpace(sub.userId)"
                            style="cursor: pointer;"
                          ></el-avatar>
                          <b
                            style="cursor: pointer; margin-left: 10px;"
                            @click="reply(sub.pid, sub.username)"
                            >{{ sub.username }}</b
                          >
                          <span>
                            回复
                            <span style="color: cornflowerblue"
                              >@{{ sub.target }}</span
                            >
                            <span style="color: #666; margin-left: 10px">{{
                              sub.content
                            }}</span>
                          </span>
                          <div style="width: 200px; margin-top: 15px">
                            <i class="el-icon-time"></i
                            ><span style="margin-left: 5px">{{
                              item.createTime
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-dialog title="回复" v-model="dialogFormVisible" width="40%">
          <el-form :model="replyComment">
            <el-form-item label="内容" :label-width="100">
              <el-input
                v-model="replyComment.content"
                autocomplete="off"
                style="width: 80%"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveReply">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ElMessage } from "element-plus";
import { getCurrentInstance, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "@/requset/http";
import nProgress from "nprogress"; // 导入 nprogress
import "@/components/nprogress"; // 导入样式，否则看不到效果
import nprogress from "nprogress";



const globalProperties =
  getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const $api = globalProperties.$api;

const router = useRouter();
const route = useRoute();
const store = useStore();

const user = ref({});
//const image = ref("");
const isLoggedIn = ref(false);
const imageBase64 = ref("");

const titles = ref([]);
const preview = ref(null);

const aid = route.params.aid;

const article = ref({
  aid: null,
  title: null,
  content: "",
  authorId: null,
  create_time: null,
  classify: null,
  tags: [],
  status: null,
});

onMounted(async () => {
  nprogress.start();
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(localStorage.getItem("user"));
    isLoggedIn.value = true;
    imageBase64.value = user.value.avatar;
  }

  await loadArticle(aid);
  load();
  // await loadComment(aid);
  await nextTick();
  if (preview.value) {
    const anchors = preview.value.$el.querySelectorAll("h1,h2,h3,h4,h5,h6");
    const titleElements = Array.from(anchors).filter(
      (title) => !!title.innerText.trim()
    );

    if (!titleElements.length) {
      titles.value = [];
      return;
    }

    const hTags = Array.from(
      new Set(titleElements.map((title) => title.tagName))
    ).sort();

    titles.value = titleElements.map((el) => ({
      title: el.innerText,
      lineIndex: el.getAttribute("data-v-md-line"),
      indent: hTags.indexOf(el.tagName),
    }));
  }

  nprogress.done();
});

const loadArticle = async (aid) => {
  try {
    const res = await $api.articleApi.getArticleByAid({
      aid: aid,
    });
    // console.log(res);
    if (res.status === 200) {
      if (res.data.code == 0) {
        article.value = res.data.data;
        article.value.tags = JSON.parse(article.value.tags);
        //console.log(article.value);
      } else {
        ElMessage.error(res.data.msg);
      }
    } else {
      ElMessage.error("加载文章失败");
    }
  } catch (err) {
    console.error("加载文章失败", err);
  }
};

const handleAnchorClick = (anchor) => {
  const { lineIndex } = anchor;
  const heading = preview.value.$el.querySelector(
    `[data-v-md-line="${lineIndex}"]`
  );

  if (heading) {
    // 注意：如果你使用的是编辑组件的预览模式,则这里的方法名改为 previewScrollToTarget
    preview.value.scrollToTarget({
      target: heading,
      scrollContainer: window,
      top: 60,
    });
  }
};

const goToLogin = () => {
  router.push("/login"); // 跳转到登录页面
};

const goToSignup = () => {
  router.push("/register"); // 跳转到注册页面
};

const goToInfo = () => {
  router.push("/home/info");
};

const goToSpace = (uid) => {
  router.push(`/space/${uid}`);
};

const goToRelease = () => {
  router.push("/release");
};

const goToAbout = () => {
  router.push("/home/about");
};

const signout = () => {
  store.commit("signout"); // 调用 Vuex 的 logout mutation
  location.reload();
};

const value = ref(0);
const comments = ref([]);
const pid = ref(0);
const comment = ref({
  rate: 0,
  content: "",
});
const replyComment = ref({});
const dialogFormVisible = ref(false);

const load = async () => {
  try {
    const res = await axios.get("/comment/list?foreignId=" + aid);
    if (res.status === 500) {
      ElMessage.error("系统错误");
      return;
    }
    console.log(res);
    const data = res.data;
    value.value = data.rate;
    comments.value = data.comments;
    // 遍历评论并加载用户头像
    for (const comment of comments.value) {
      comment.user = await getUser(comment.userId);
      for (const children of comment.children) {
        children.user = await getUser(children.userId);
      }
    }
    console.log(comments.value);
  } catch (error) {
    console.error("加载评论失败", error);
  }
};

const getUser = async (uid) => {
  try {
    const userRes = await $api.userApi.getuserbyuid({ uid: uid });
    if (userRes.status === 200) {
      if (userRes.data.code === 0) {
        return userRes.data.data;
      } else {
        ElMessage.error(userRes.data.msg);
      }
    } else {
      ElMessage.error("加载用户失败");
    }
  } catch (error) {
    console.error("加载用户失败", error);
  }
};

const reply = (pid, target) => {
  // console.log(pid, target);
  replyComment.value = {
    pid: pid,
    userId: user.value.uid,
    username: user.value.username,
    foreignId: aid,
    target: target,
  };
  dialogFormVisible.value = true;
  // console.log(dialogFormVisible.value);
};

const saveReply = async () => {
  try {
    const res = await axios({
      url: "/comment/save",
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      data: JSON.stringify(replyComment.value),
    });
    if (res.status === 200) {
      ElMessage.success("评论成功");
      load();
      replyComment.value = {};
      dialogFormVisible.value = false;
    }
  } catch (error) {
    console.error("保存回复失败", error);
  }
};

const submit = async () => {
  comment.value.userId = user.value.uid;
  comment.value.username = user.value.username;
  comment.value.foreignId = aid;

  try {
    const res = await axios({
      url: "/comment/save",
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      data: JSON.stringify(comment.value),
    });
    if (res.status === 200) {
      ElMessage.success("评论成功");
      load();
      comment.value = { rate: 0, content: "" };
    }
  } catch (error) {
    console.error("提交评论失败", error);
  }
};
</script>
  
  <style scoped>
.article-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s;
  width: 66%;
  margin: 0 auto;
}

.article-container h1 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center; /* 标题居中 */
}
.article-container div {
  font-size: 16px;
  line-height: 1.6;
}

.article-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
  background: #f8f8f8;
}

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

.release-button {
  color: white;
  text-decoration: none;
  font-size: 18px;
  display: flex; /* 使用 flex 布局 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 水平居中对齐 */
  padding: 10px 15px;
  border-radius: 5px;
  background-color: #ef632b;
  border: none;
  cursor: pointer;
}

.release-button:hover {
  background-color: #f97d1c;
  color: white; /* 保持字体颜色不变 */
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
a,
p a code {
  color: #3eaf7c;
}

.anchor-link {
  text-decoration: none; /* 默认情况下不显示下划线 */
}

.anchor-link:hover {
  text-decoration: underline; /* 鼠标悬停时显示下划线 */
}

.comment-container {
  margin-top: 20px;
}

.comment-container .el-comment {
  margin-bottom: 20px;
}

.comment-container .el-input {
  margin-bottom: 10px;
}
</style>