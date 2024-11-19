<template>
    <div class="music-track">
      <h3>{{ track.name }}</h3>
      <ul>
        <li v-for="(note, index) in track.notes" :key="index">
          音符: {{ note.pitch }}, 持续时间: {{ note.duration }} 秒
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      track: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .music-track {
    margin: 20px 0;
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .music-track h3 {
    margin-bottom: 10px;
  }
  
  .music-track ul {
    list-style-type: none;
    padding: 0;
  }
  
  .music-track li {
    padding: 5px 0;
  }
  </style>
  