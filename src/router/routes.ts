import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/Index.vue') },
      { path: '/home', component: () => import('pages/Home.vue') },
      { path: '/relatorios/historicos', component: () => import('components/Report/HistoryTests.vue') },
      { path: '/relatorios/graficos', component: () => import('pages/Reports.vue') },
      { path: '/TestManager', component: () => import('components/TestScreen/TestManagement.vue') },
      { path: '/testes/gerenciar', component: () => import('pages/TestScreen/TestManager.vue') },
      { path: '/testes/cadastrar', name: 'cadastrar', component: () => import('pages/uList.vue') },
      { path: '/ResetPassword', component: () => import('pages/RecoverPassword/ResetPassword.vue') },
      { path: '/usuarios/gerenciar', component: () => import('pages/UserScreen/UserManager.vue') },
      { path: '*', component: () => import('pages/Error404.vue') }
    ]
  },
]

export default routes
