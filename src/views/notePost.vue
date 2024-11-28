<template>
    <div class="container">
        <div class="title">
            <button class="button-img" @click="uploadImg" >上传图片</button>
            <button class="button-video" @click="uploadVideo">上传视频</button>
        </div>
        <div class="upload-container">
            <div 
                class="upload-box" 
                @drop.prevent="handleDrop" 
                @dragover.prevent
            >
                <p>拖拽文件到这里上传</p>
                <input 
                    type="file" 
                    @change="handleFileUpload" 
                    ref="fileInput" 
                    style="display: none;" 
                />
                <button @click="triggerFileInput">选择文件</button>
            </div>
        </div>
   </div>
</template>
<script lang="ts" setup>
    import {ref} from 'vue'
    let isImgButtonActive=ref(false)
    let isVideoButtonActive=ref(false)
    function uploadImg(){
        isImgButtonActive.value=true;
    }
</script>
<style scoped>
    .container{
        
        background-color: #d9ecff;
    }
    .title{
        height:30px;
        background-color: white;
        font-size:15px;
        margin-left:0px;
        align-items: center;
        margin-top:5px;
    }
    .button-img,.button-video{
        border:none;
        background-color: #d3d3d3;
        font-size: 20px;
        cursor: pointer;
        
    }
    .button-img.active,
    .button-video.active {
        background-color: black;
        color: white; /* 点击后变黑 */
    }
    .upload-container{
        margin-top:0px;
    }
    
</style>