
import { createStore } from 'vuex';

export default createStore({
  state: {
    user: localStorage.getItem('user') ? localStorage.getItem('user') : null,
    //若localSorage存在token，将值赋给Vuex.state.token
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,

    article: localStorage.getItem('article') ? localStorage.getItem('article') : null,
    avatar: localStorage.getItem('avatar') ? localStorage.getItem('avatar') : null
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    setToken(state, token) {
      localStorage.setItem('token', token)
      state.token = token
    },
    signout(state) {
      localStorage.removeItem('token')
      state.token = null
      localStorage.removeItem('user')
      state.user = null
    },
    setArticle(state, article) {
      state.article = article
      localStorage.setItem('article', JSON.stringify(article))
    },
    setAvatar(state, avatar) {
      state.avatar = avatar
      localStorage.setItem('avatar', avatar)
    }
  }
})
