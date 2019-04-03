import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
// import HomePage from '@/views/DAGBoard/HomePage'
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'index',
    meta: { title: '首页', icon: 'dashboard' },
    // hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/tasks',
    component: Layout,
    children: [
      {
        path: 'tasks',
        name: 'tasks',
        component: () => import('@/views/tasks/index'),
        meta: { title: '定时任务', icon: 'tasks' }
      }
    ]
  },
  {
    path: '/DAGBoard',
    component:Layout,
    // component: () => import('@/views/DAGBoard/HomePage'),
    // meta: { title: 'HomePage', icon: 'tasks' },
    children: [
      {
        path: 'DAGBoard',
        name: 'DAGBoard',
        component: () => import('@/views/DAGBoard/HomePage'),
        meta: { title: 'DAGBoard', icon: 'tasks' }
      }
    ]
  },

  {
    path: '/newdag',
    component: Layout,
    children: [
      {
        path: 'newdag',
        name: 'newdag',
        component: () => import('@/views/dags/index'),
        meta: { title: 'DAG任务流', icon: 'dag' }
      }
    ]
  },
  {
    path: '/woker',
    component: Layout,
    children: [
      {
        path: 'woker',
        name: 'woker',
        component: () => import('@/views/woker/index'),
        meta: { title: 'Woker节点', icon: 'tree' }
      }
    ]
  },

  {
    path: '/timing',
    component: Layout,
    redirect: '/timing/crontabs',
    name: 'timing',
    meta: { title: '定时管理', icon: 'timing' },
    children: [
      {
        path: 'crontabs',
        name: 'crontabs',
        component: () => import('@/views/timing/crontabs/index'),
        meta: { title: 'Crontab定时', icon: 'crontab' }
      },
      {
        path: 'interval',
        name: 'interval',
        component: () => import('@/views/timing/interval/index'),
        meta: { title: '时间间隔', icon: 'interval' }
      }
    ]
  },


  { path: '*', redirect: '/404', hidden: true }
];

const router = new Router({
  mode: 'history', //后端支持可开 避免#出现
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

router.beforeEach((to, from, next) => {//beforeEach是router的钩子函数，在进入路由前执行
  if (to.meta.title) {//判断是否有标题
    document.title = "分布式定时调度系统 - " + to.meta.title
  }
  next()//执行进入路由，如果不写就不会进入目标页
})


export default router
