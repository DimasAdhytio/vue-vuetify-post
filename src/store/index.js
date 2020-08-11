import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("access_token") || null
  },
  getters: {
    onLogin(state) {
      return state.token != null
    }
  },
  mutations: {
    getKey(state, token) {
      state.token = token
    }
  },
  actions: {
    login({ commit },data) {

      return new Promise((resolve, reject) => {
        Axios.post("https://dev.mopaps.xtend.net.my/oauth",{
          client_id:	"mopaps-web",
          client_secret:	"a3fb9l4cf4",
          grant_type:	"password",
          password:	data.pass,
          username:	data.username
        }).then(response => {
          const token = response.data.access_token
          localStorage.setItem("access_token", token)
          commit('getKey',token)
          resolve(response)
        }).catch(error => {
          console.log(error);
          alert(error)
          reject(error)
        })
      })
    }
  },
  modules: {
  }
})
