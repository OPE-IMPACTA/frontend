import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/Index.vue') },
      { path: '/home', component: () => import('pages/Home.vue') },
      { path: '/usuarios/gerenciar', component: () => import('pages/UserScreen/UserManager.vue') },
      { path: '/clientes/gerenciar', component: () => import('pages/ClientScreen/ClientManager.vue') },
      { path: '/projetos/gerenciar', component: () => import('pages/ProjectsScreen/ProjectManager.vue') },
      { path: '/tarefas/gerenciar', name: 'tarefas', component: () => import('pages/TasksScreen/TasksManager.vue') },
      { path: '*', component: () => import('pages/Error404.vue') }
    ]
  }
]

export default routes
