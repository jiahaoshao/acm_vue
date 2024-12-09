<template>
    <div class="comment">
      <div class="comment-author">
        <el-avatar :src="authorAvatar" />
        <span class="author-name">{{ authorName }}</span>
        <span class="comment-time">{{ datetime }}</span>
      </div>
      <div class="comment-content">{{ content }}</div>
      <div class="comment-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    authorAvatar: String,
    authorName: String,
    content: String,
    datetime: String,
  });
  </script>
  
  <style scoped>
  .comment {
    padding: 10px;
    border-bottom: 1px solid #eaeaea;
  }
  
  .comment-author {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .author-name {
    margin-left: 10px;
    font-weight: bold;
  }
  
  .comment-time {
    margin-left: auto;
    color: #888;
    font-size: 12px;
  }
  
  .comment-content {
    margin-bottom: 5px;
  }
  
  .comment-actions {
    text-align: right;
  }
  </style>