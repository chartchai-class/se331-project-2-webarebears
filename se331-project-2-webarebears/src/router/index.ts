import { createRouter, createWebHistory } from 'vue-router'
import EventListView from '@/views/ListView.vue'
import LayoutView from '@/views/event/LayoutView.vue'
import CountryDetail from '@/views/event/CountryDetailView.vue'
import MedalDetail from '@/views/event/MedalView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import NetworkErrorView from '@/views/NetworkErrorView.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Comment from '@/views/event/CommentView.vue'
import nProgress from 'nprogress'
import EventService from '@/services/Service'
import { useEventStore } from '@/stores/event'
import ViewUserList from '@/views/ViewUSerList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list-view',
      component: EventListView,
      props: (route) => ({ page: parseInt(route.query.page?.toString() || '1') })
    },
    {
      path: '/country/:id',
      name: 'layout-view',
      component: LayoutView,
      props: true,
      beforeEnter: async (to, from, next) => {
        const eventStore = useEventStore()
        const id = to.params.id as string
        try {
          const event = await EventService.getEvent(id)
          if (event) {
            eventStore.setEvent(event)
            next()
          } else {
            next({ name: '404-resource-view', params: { resource: 'country' } })
          }
        } catch (error) {
          console.error('Error fetching country data:', error)
          next({ name: 'network-error-view', params: { resource: 'page' } })
        }
      },
      children: [
        {
          path: 'details',
          name: 'country-detail-view',
          component: CountryDetail,
          props: true
        },
        {
          path: 'medals',
          name: 'medal-detail-view',
          component: MedalDetail,
          props: true
        },
        {
          path: 'comment',
          name: 'comment-view',
          component: Comment,
          props: true
        }

      ]
    },
    {
      path: '/404/:resource',
      name: '404-resource-view',
      component: NotFoundView,
      props: true
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView
    },
    {
      path: '/network-error',
      name: 'network-error-view',
      component: NetworkErrorView
    },{
      path:'/login',
      name: 'login',
      component:Login
    }
    ,{
      path:'/signup',
      name: 'signup',
      component:Signup
    }
    ,{
      path:'/viewlist',
      name: 'viewlist',
      component:ViewUserList
    }
  

  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach(() => {
  nProgress.start()
})

router.afterEach(() => {
  nProgress.done()
})



export default router
