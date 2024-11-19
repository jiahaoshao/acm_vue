import { createStore } from 'vuex';

export default createStore({
  state: {
    user: localStorage.getItem('user') ? localStorage.getItem('user') : null,
    //若localSorage存在token，将值赋给Vuex.state.token
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
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
    logout(state) {
      localStorage.removeItem('token')
      state.token = null
      localStorage.removeItem('user')
      state.user = null
    }
  }
})
