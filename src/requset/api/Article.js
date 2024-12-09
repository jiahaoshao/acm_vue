import axios from '@/requset/http';
const articleApi = {
  getArticle(page, limit, status) {
    return axios.get('/articles/getarticles', {
      params: {
        page: page,
        limit: limit,
        status: status
      }
    });
  },
  uploadArticleImages(params){
    return axios({
        url: "github/upload",
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
  getArticleByAid(params){
    return axios.get('/articles/getarticlebyaid', {params:params});
  },
  getCommentByParentId(params){
    return axios.get('/articles/getcommentbyparentid', {params:params});
  },
  addComment(params){
    return axios.post('/articles/addcomment', params);
  },
  
};

export default articleApi;