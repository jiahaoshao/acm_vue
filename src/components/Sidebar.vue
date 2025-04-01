<template>
    <div
      class="sidebar"
      :class="{ expanded: isExpanded }"
      @mouseenter="isExpanded = true"
      @mouseleave="isExpanded = false"
    >
      <ul class="nav-list">
        <li v-for="item in navItems" :key="item.name" class="nav-item">
          <el-icon>
            <component :is="item.iconComponent" />
          </el-icon>
          <span v-if="isExpanded" class="nav-text">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { ChatLineRound, Sell, DataAnalysis, DataBoard, Message } from '@element-plus/icons-vue'

  const isExpanded = ref(false);
  const navItems = [
  { name: "创意交流区", iconComponent: ChatLineRound },
  { name: "创意交易讨论区", iconComponent: Sell },
  { name: "AI 技术分享区", iconComponent: DataAnalysis },
  { name: "活动公告与报名区", iconComponent: DataBoard },
  { name: "用户反馈区", iconComponent: Message }
  ];
  </script>
  
  <style scoped>
  .sidebar {
    position: fixed;
    left: 0;
    top: 80px; /* 顶部偏移 */
    height: calc(100vh - 100px);
    width: 60px; /* 收起时宽度 */
    background-color: #fff; /* 改为白色背景 */
    transition: width 0.3s;
    overflow: hidden;
    color: #000; /* 改为黑色文字 */
    z-index: 500; /* 保持低于顶部导航栏 */
    padding-top: 20px;
  }
  
  .sidebar.expanded {
    width: 200px; /* 展开时宽度 */
  }
  
  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    padding: 15px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .nav-item:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .nav-item i {
    font-size: 24px;
    margin-right: 10px;
  }
  
  .nav-text {
    font-size: 16px;
  }
  </style>