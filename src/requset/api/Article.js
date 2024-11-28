import axios from '@/requset/http';
const articleApi = {
    getArticle(page,limit){
      return axios.get('/articles/getArticles', {
        params:{
            page:page,
            limit:limit
        }
      });
    },
    getArticleById(articleId){
        return axios.post('',{
            params:{
                articleId:articleId
            }
        })
    }
  };
  
  export default articleApi;