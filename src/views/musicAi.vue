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
            
          <!-- 音乐创作部分 -->
          <div class="music-wrapper">
            <!-- 音乐创作设置区域 -->
            <div class="music-settings">
              <h3>音乐创作设置</h3>
              <el-form :model="musicSettings" label-width="120px">
                <el-form-item label="情感">
                  <el-select v-model="musicSettings.emotion" placeholder="请选择情感">
                    <el-option label="快乐" value="happy"></el-option>
                    <el-option label="悲伤" value="sad"></el-option>
                    <el-option label="兴奋" value="excited"></el-option>
                    <el-option label="平静" value="calm"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="歌词">
                  <el-input v-model="musicSettings.lyrics" placeholder="请输入歌词..."></el-input>
                </el-form-item>
                <el-form-item label="音乐风格">
                  <el-select v-model="musicSettings.genre" placeholder="请选择风格">
                    <el-option label="流行" value="pop"></el-option>
                    <el-option label="摇滚" value="rock"></el-option>
                    <el-option label="爵士" value="jazz"></el-option>
                    <el-option label="电子" value="electronic"></el-option>
                  </el-select>
                </el-form-item>
                <el-button @click="generateMusic" type="primary">生成音乐</el-button>
              </el-form>
            </div>
  
            <!-- 音乐播放器部分 -->
            <div class="music-player" v-if="musicUrl">
              <h3>音乐播放</h3>
              <audio :src="musicUrl" controls></audio>
              <el-button @click="saveMusic" type="success" class="save-btn">保存音乐</el-button>
            </div>
          </div>
        </el-footer>
      </el-container>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref } from 'vue';
  export default {
    name: 'MusicAi',
    setup() {
      // 音乐创作设置
      const musicSettings = ref({
        emotion: '',
        lyrics: '',
        genre: ''
      });
      
      const musicUrl = ref('');
  
      // 生成音乐
      const generateMusic = async () => {
        if (!musicSettings.value.emotion || !musicSettings.value.lyrics || !musicSettings.value.genre) {
          alert("请填写完整的创作设置！");
          return;
        }
  
        try {
          // 假设后端接口是 /generate_music
          const response = await axios.post('http://localhost:5000/generate_music', musicSettings.value);
  
          // 返回音乐的 URL
          musicUrl.value = response.data.musicUrl;  // 假设返回的是音乐文件的 URL
        } catch (error) {
          console.error('Error:', error);
          alert("生成音乐失败，请稍后再试。");
        }
      };
  
      // 保存音乐
      const saveMusic = () => {
        if (!musicUrl.value) return alert("没有可保存的音乐！");
  
        const link = document.createElement('a');
        link.href = musicUrl.value;
        link.download = 'generated_music.mp3';  // 假设文件名是 generated_music.mp3
        link.click();
      };
  
      return {
        musicSettings,
        musicUrl,
        generateMusic,
        saveMusic
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
    height: 50px;
    background-color: #2c3e50;
    color: white;
    padding-bottom: 5px;
  }
  
  .title {
    margin-left: 20px;
    font-size: 22px;
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
    margin-left: 30px;
    font-size: 24px;
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
  
  /* 音乐创作设置部分 */
  .music-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    margin: 20px auto;
  }
  
  .music-settings {
    width: 48%;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .music-settings h3 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .music-player {
    width: 48%;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .save-btn {
    margin-top: 20px;
    width: 100%;
    background-color: #42b983;
    color: white;
  }
  
  .save-btn:hover {
    background-color: #367f5b;
  }
  
  .el-form-item {
    margin-bottom: 20px;
  }
  </style>
  