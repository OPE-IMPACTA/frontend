import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/Index.vue') },
      { path: '/home', component: () => import('pages/Home.vue') },
      { path: '/ReportTests', component: () => import('components/Report/ReportTests.vue') },
      { path: '/TestManager', component: () => import('components/TestScreen/TestManager.vue') },
      { path: '/testes/gerenciar', component: () => import('components/TestScreen/List.vue') },
      { path: '/testes/cadastrar', name: 'cadastrar', component: () => import('pages/PageCadastro.vue') },
      { path: '/ResetPassword', component: () => import('pages/RecoverPassword/ResetPassword.vue') },
      { path: '/usuarios/gerenciar', component: () => import('pages/uList.vue') },
      { path: '*', component: () => import('pages/Error404.vue') }
    ]
  },
]

export default routes
