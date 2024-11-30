import axios from '@/requset/http';
const articleApi = {
  getArticle(page, limit) {
    return axios.get('/articles/getarticles', {
      params: {
        page: page,
        limit: limit
      }
    });
  },
  uploadArticleImages(params){
    return axios({
        url: "upload/article_images",
        method: "post",
        data: params,
        headers:{
            'Content-Type': 'multipart/form-data',
        }
    })
  },
  updateArticle(params){
    return axios.post('/articles/update_article', params);
    },
    getArticleById(articleId){
        return axios.post('',{
            params:{
                articleId:articleId
            }
        })
  },
  getAuthorInfo(uid){
    return axios.get('/user/finduserbyuid',{
      params:{
        uid:uid
      }
    })
  },
  getArticleById(id){
    return axios.get('/articles/getArticleById',
    {
      params:{
        id:id
      }
    })
  }
};

export default articleApi;