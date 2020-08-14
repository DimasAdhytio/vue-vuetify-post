import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: {
      token: localStorage.getItem("access_token") || null,
      data: JSON.parse(localStorage.getItem("account_data")) || null,
      refreshToken: localStorage.getItem("refresh_token") || null
    },
    post: []
  },
  getters: {
    onLogin(state) {
      return state.account.token != null
    },
    showPost(state) {
      return state.post.slice().reverse()
    },
    dataUser(state) {
      return state.account.data
    }
  },
  mutations: {
    getKey(state, data) {
      state.account.token = data.token
      state.account.refreshToken = data.refresh
    },
    fetchUserData(state,data) {
      state.account.data = data
      // console.log(state.account.data);
      // console.log(data);
    },
    destroyKey(state) {
      state.account.token = null
      state.account.data = null
      state.account.refreshToken = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('account_data')
    },
    fetchPost(state,data) {
      data.forEach(items => {
        items.username = `Anonymous(${items.userId})`
        state.post.push(items)
      })
    },
    removePost(state,Id) {
      state.post.splice(Id, 1)
    },
    fillPost(state,data) {
      const temp_store = JSON.parse(localStorage.getItem('account_data'))
      data.temp_data.id = data.temp_id
      data.temp_data.username = temp_store.username
      state.post.push(data.temp_data)
    },
    editPost(state,data) {
      state.post.splice(data.index, 1, {
        userId: data.temp_data.userId,
        id: data.temp_data.id,
        username: data.temp_data.username,
        title: data.temp_data.title,
        body: data.temp_data.body,
      })
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
          const data = {
            token : response.data.access_token,
            refresh: response.data.refresh_token
          }
          localStorage.setItem("access_token", data.token)
          localStorage.setItem('refresh_token',data.refresh)
          
          commit('getKey',data)
          resolve(response)
        }).catch(error => {
          console.log(error);
          alert(error)
          reject(error)
        })
      })
    },
    userData({commit}) {
      Axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.state.account.token

      Axios.get("https://dev.mopaps.xtend.net.my/api/me")
      .then(response => {
        const data = response.data
        localStorage.setItem('account_data', JSON.stringify(data))
        commit('fetchUserData',data)
      })
    },
    logout({ commit }) {
      Axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.state.account.token

      return new Promise((resolve,reject) => {
        Axios.post('https://dev.mopaps.xtend.net.my/oauth/revoke',{
          token: this.state.account.token,
          token_type_hint: 'access_token'
        })
        .then(response => {
          console.log(response);
          commit('destroyKey')
          resolve(response)
        }).catch(error => {
          alert(error)
          reject(error)
        })
      })
    },
    takePost({ commit }) {
      Axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        const post = response.data
        commit('fetchPost',post)
      })
    },
    delPost({ commit }, Id) {
      Axios.delete(`https://jsonplaceholder.typicode.com/posts/${Id}`)
      .then(() => {
        commit('removePost',Id)
      })
    },
    inPost(context, data) {
      const temp_id = context.state.post.length + 1
      const temp_store = JSON.parse(localStorage.getItem("account_data"))
      Axios.post('https://jsonplaceholder.typicode.com/posts', {
        userId: temp_store.uuid,
        id: temp_id,
        title: data.title,
        body: data.text
      }).then(response => {
        const temp_data = response.data
        context.commit('fillPost',{temp_id, temp_data})
      }).catch(error => {
        console.log(error);
      })
    },
    edPost(context, data) {
      const index = context.state.post.findIndex(item => item.id == data.id)
      const user = context.state.post.filter(item => item.id == data.id)
      Axios.patch(`https://jsonplaceholder.typicode.com/posts/${index}`, {
        title: data.title,
        body: data.text
      }).then( response => {
        const temp_data = {
          userId: user[0].userId,
          id: user[0].id,
          username: user[0].username,
          title: response.data.title,
          body: response.data.body
        }
        this.commit('editPost',{index, temp_data})
      }).catch(error => {
        console.log(error);
      })
    }
  },
  modules: {
  }
})
