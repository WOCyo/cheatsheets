import axios from 'axios'

const server = axios.create()
const client = axios.create()

server.defaults.headers.authorization = 'token e9bac274d2f2f05057887640c1f6f713a89085af'

export enum HOST {
  MOCK = 'http://localhost:8080/api',
  CLIENT = '/api',
  SERVER = 'https://api.github.com',
}

export const request = {
  server: {
    get: async <T, Q>(
      path: string,
      { params, data }: { params?: Q; data?: Q } = {},
      { host }: { host?: HOST } = { host: HOST.CLIENT },
    ): Promise<T> => {
      return server.get(`${host}${path}`, { data, params }).then(res => res.data)
    },
    post: async <T, Q>(
      path: string,
      { params }: { params?: Q } = {},
      { host }: { host: HOST } = { host: HOST.CLIENT },
    ): Promise<T> => {
      return server.post(`${host}${path}`, params).then(res => res.data)
    },
  },
  client: {
    get: async <T, Q>(
      path: string,
      { params, data }: { params?: Q; data?: Q } = {},
      { host }: { host?: HOST } = { host: HOST.CLIENT },
    ): Promise<T> => {
      return client.get(`${host}${path}`, { data, params }).then(res => res.data)
    },
    post: async <T, Q>(
      path: string,
      { params }: { params?: Q } = {},
      { host }: { host: HOST } = { host: HOST.CLIENT },
    ): Promise<T> => {
      return client.post(`${host}${path}`, params).then(res => res.data)
    },
  },
}
