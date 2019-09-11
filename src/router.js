import Vue from 'vue'
import Router from 'vue-router'
import TodoForm from './components/TodoForm'
import { components, AmplifyEventBus } from 'aws-amplify-vue'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'

Vue.use(Router)
Vue.use(AmplifyPlugin, AmplifyModules, Amplify)

let user;

getUser().then((user, error) => {
  if (user) {
    router.push({path: '/'})
  }
})

AmplifyEventBus.$on('authState', async (state) => {
  if (state === 'signedOut'){
    user = null;
    router.push({path: '/auth'})
  } else if (state === 'signedIn') {
    user = await getUser();
    router.push({path: '/'})
  }
});

function getUser() {
  return Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then((data) => {
    if (data && data.signInUserSession) {
      return data;
    } 
  }).catch((e) => {
    return null
  });
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'TodoForm',
      component: TodoForm,
      meta: { requiresAuth: true}
    },
    {
      path: '/auth',
      name: 'Authenticator',
      component: components.Authenticator
    }
  ]
});

router.beforeResolve(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    user = await getUser();
    if (!user) {
      return next({
        path: '/auth',
        query: {
          redirect: to.fullPath,
        }
      });
    }
    return next()
  }
  return next()
})

export default router
