const MainLayout = () => import('../views/MainLayout')
const Error404 = () => import('../views/Error/error-404')
const Login = () => import('../views/Login/index')
const Home = () => import('../views/Home')
const User = () => import('../views/User')
const UserList = () => import('../views/User/user-list')
const UserRegister = () => import('../views/User/user-register')
const UserUpdate = () => import('../views/User/user-update')
const Client = () => import('../views/Client')
const ClientList = () => import('../views/Client/client-list')
const ClientRegister = () => import('../views/Client/client-register')
const ClientUpdate = () => import('../views/Client/client-update')
const Project = () => import('../views/Project')
const ProjectList = () => import('../views/Project/project-list')
const ProjectRegister = () => import('../views/Project/project-register')
const ProjectUpdate = () => import('../views/Project/project-update')
const Task = () => import('../views/Task')
const TaskList = () => import('../views/Task/task-list')
const TaskRegister = () => import('../views/Task/task-register')
const TaskUpdate = () => import('../views/Task/task-update')

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: Login
      },
      {
        path: '/home',
        name: 'Home',
        meta: {
          hasAuth: true
        },
        component: Home
      },
      {
        path: '/user',
        component: User,
        children: [
          {
            path: '',
            name: 'User',
            meta: {
              hasAuth: true
            },
            component: UserList
          },
          {
            path: '/user/register',
            name: 'UserRegister',
            meta: {
              hasAuth: true
            },
            component: UserRegister
          },
          {
            path: '/user/update',
            name: 'UserUpdate',
            meta: {
              hasAuth: true
            },
            props: true,
            component: UserUpdate
          }
        ]
      },
      {
        path: '/client',
        component: Client,
        children: [
          {
            path: '',
            name: 'Client',
            meta: {
              hasAuth: true
            },
            component: ClientList
          },
          {
            path: '/client/register',
            name: 'ClientRegister',
            meta: {
              hasAuth: true
            },
            component: ClientRegister
          },
          {
            path: '/client/update',
            name: 'ClientUpdate',
            props: true,
            meta: {
              hasAuth: true
            },
            component: ClientUpdate
          }
        ]
      },
      {
        path: '/project',
        component: Project,
        children: [
          {
            path: '',
            name: 'Project',
            meta: {
              hasAuth: true
            },
            component: ProjectList
          },
          {
            path: '/project/register',
            name: 'ProjectRegister',
            meta: {
              hasAuth: true
            },
            component: ProjectRegister
          },
          {
            path: '/project/update',
            name: 'ProjectUpdate',
            props: true,
            meta: {
              hasAuth: true
            },
            component: ProjectUpdate
          }
        ]
      },
      {
        path: '/task',
        component: Task,
        children: [
          {
            path: '',
            name: 'Task',
            meta: {
              hasAuth: true
            },
            component: TaskList
          },
          {
            path: '/task/register',
            name: 'TaskRegister',
            meta: {
              hasAuth: true
            },
            component: TaskRegister
          },
          {
            path: '/task/update',
            name: 'TaskUpdate',
            props: true,
            meta: {
              hasAuth: true
            },
            component: TaskUpdate
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: Error404
  }
]

export default routes
