import axios from 'axios'
import sleep from '../utils/sleep'
import UserService from './user'
import ClientService from './client'
import ProjectService from './project'
import TaskService from './task'
import GroupService from './group'

import {
  Loading,
  QSpinnerDots
} from 'quasar'

const API_ENVS = {
  production: ' https://backend-ope.herokuapp.com/',
  development: '',
  local: 'http://localhost:3000'
}

const httpClient = axios.create({
  baseURL: API_ENVS[process.env.NODE_ENV] || API_ENVS.local
})

httpClient.interceptors.request.use(async (config) => {
  const token = window.localStorage.getItem('token')
  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`
  }

  if (config.showLoading) {
    const optLoading = {
      spinner: QSpinnerDots,
      spinnerColor: 'orange',
      message: '',
      delay: 400
    }

    Loading.show(optLoading)
    await sleep(2000)
  }

  return config
})

httpClient.interceptors.response.use((response) => {
  Loading.hide()
  return response
}, (error) => {
  const canThrowAnError = error.request.status === 0 || error.request.status === 500

  if (canThrowAnError) {
    Loading.hide()
    throw new Error(error.message)
  }

  Loading.hide()
  return error
})

export default {
  user: UserService(httpClient),
  client: ClientService(httpClient),
  project: ProjectService(httpClient),
  task: TaskService(httpClient),
  group: GroupService(httpClient)
}
