import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to,from,next) => {
  if(to.matched.some(record => record.meta.requireAuth)) {
    if(!store.getters.onLogin) {
      next({name:'Login'})
    }else{
      next()
    }
  }else if(to.matched.some(record => record.meta.requireVisitor)) {
    if(store.getters.onLogin) {
      next({name:'Dashboard'})
    }else{
      next()
    }
  }else{
    next()
  }
})
