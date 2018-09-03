import Vue from 'vue'
import Router from 'vue-router'
import QandA from '@/components/QandA'
import QandAPC from '@/components/QandAPC'

const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'QandA',
      component: isMobile ? QandA : QandAPC
    }
  ]
})
