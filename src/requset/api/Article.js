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
  // uploadArticleImages(params){
  //   return axios({
  //       url: "upload/article_images",
  //       method: "post",
  //       data: params,
  //       headers:{
  //           'Content-Type': 'multipart/form-data',
  //       }
  //   })
  // },
  // uploadArticleImages(params){
  //   return axios({
  //       url: "upload/uploadImg",
  //       method: "post",
  //       data: params,
  //       headers:{
  //           'Content-Type': 'multipart/form-data',
  //       }
  //   })
  // },
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
  }
};

export default articleApi;