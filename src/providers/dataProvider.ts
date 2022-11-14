import { DataProvider } from "@pankod/refine-core";
import axios, { AxiosResponse } from "axios";


// function resolvePath(...pathList: string[]) {
//   return pathList.map<string>((item, index) => {
//     if (index !== pathList.length - 1) {
//       return item.replace(/\/*$/, '')
//     }
//     return item
//   }).join('/')
// }

function resolveResp(resp: AxiosResponse<any, any>) {
  if (resp.status < 300 && resp.status >= 200) {
    return resp.data.data
  }
  return null
}

export const FireboomDataProvider = (apiUrl: string = '/app/main/operations'): DataProvider => {
  const client = axios.create({ baseURL: apiUrl })
  return {
    async getList({ resource, hasPagination, pagination, metaData, sort, filters }) {
      const data = resolveResp(await client.get(`/Get${resource}List`,))
      return data ? data : { total: 0, data: data.data }
    },
    async getMany({ resource, metaData, ids }) {
      const data = resolveResp(await client.get(`/GetMany${resource}`, { params: { ids } }))
      return data ? data.data : []
    },
    async getOne({ id, resource }) {
      const data = resolveResp(await client.get(`/GetOne${resource}`, { params: { id: +id } }))
      return data
    },
    async create({ resource, variables, metaData }) {
      const data = resolveResp(await client.post(`/CreateOne${resource}`, variables))
      return data
    },
    async update({ id, resource, variables, metaData }) {
      const data = resolveResp(await client.post(`/UpdateOne${resource}`, { ...variables, id: +id }))
      return data
    },
    async deleteOne({ id, resource, variables }) {
      const data = resolveResp(await client.post(`/DeleteOne${resource}`, { ...variables, id: +id }))
      return data
    },
    getApiUrl() {
      return client.getUri()
    }
  }
}