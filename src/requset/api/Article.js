import axios from '@/requset/http';
const articleApi = {
    getArticle(page,limit){
      return axios.get('/articles/getArticles', {
        params:{
            page:page,
            limit:limit
        }
      });
    }
  };
  
  export default articleApi;