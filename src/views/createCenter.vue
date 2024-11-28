<template>
    <div class="common-layout">
      <el-container>
        <el-header class="header">
            <img  class="idea" src="../assets/logo.png" alt="idea">
            <span class="title">创作中心</span>
        </el-header>
        <el-container>
          <el-aside class="side" width="200px">
            <nav>
               <ul>
                <li><router-link to="/createCenter/notePost">发布笔记</router-link></li>
                <li><router-link to="/createCenter/noteManager">管理笔记</router-link></li>
                <li><a href="#/ai" target="'_blank'">AI助手</a></li>
               </ul>
            </nav>
          </el-aside>
          <el-main>
            <router-view></router-view>
      <!-- 渲染子路由 -->
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>
<script>
</script>
<style scoped>
    .header{
        background-color: #2c3e50;
        height: 80px !important;   
        display: flex;
        justify-content: center;
        align-items: center; 
       
    }
    .idea{
        width: 50px;
        margin-right: 10px;      
    }
    .title{
       
        color:white;
        font-size: 25px;

    }
    .side{
        height: 100%;
        color: white;
    }
    .size nav {
        display: flex;
        justify-content: center; /* 左右分布 */
        align-items: center; /* 垂直居中 */
        list-style: none;
    }
    .side li{
        margin-top:30px;
    }
    .side li a{
        text-decoration: none;
        margin-top:30px;
        font-size:20px;
        color:#2c3e50;
        padding: 10px;
    }
    .side li a:hover{
        color: red;
    }
    .router-link-active {
        background-color: #42b983; /* 选中的项变色 */
        color: white; /* 选中的项文字颜色 */
        border-radius: 5px;
        }
</style>