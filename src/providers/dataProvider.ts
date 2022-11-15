import { CrudOperators, DataProvider, LogicalFilter } from "@pankod/refine-core";
import { message } from "antd";
import axios, { AxiosError, AxiosResponse } from "axios";


// function resolvePath(...pathList: string[]) {
//   return pathList.map<string>((item, index) => {
//     if (index !== pathList.length - 1) {
//       return item.replace(/\/*$/, '')
//     }
//     return item
//   }).join('/')
// }

async function resolveResp(respPromise: Promise<AxiosResponse<any, any>>) {
  let msg
  try {
    const resp = await respPromise 
    if (resp.status < 300 && resp.status >= 200) {
      return resp.data.data
    }
    if (resp.data) {
      msg = resp.data.message ?? resp.data
    } else {
      msg = resp.statusText
    }
  } catch(e) {
    const err = e as AxiosError
    msg = err.message
  }
  message.error(msg)
  return null
}

export type SimpleGraphqlQueryOperation = 'equals' | 'gt' | 'gte' | 'in' | 'lt' | 'lte' | 'notIn' | 'contains' | 'startsWith' | 'endsWith' | 'mode'

export type GraphqlQueryOperation = SimpleGraphqlQueryOperation | { not: SimpleGraphqlQueryOperation }

/**
 * 把 refine 定义的 operator 转换成 grqph 的查询语句里的查询条件
 */
const simpleMatch: Record<Extract<CrudOperators, 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'startswith' | 'endswith' | 'contains'>, SimpleGraphqlQueryOperation> = {
  eq: 'equals',
  gt: 'gt',
  gte: 'gte',
  lt: 'lt',
  lte: 'lte',
  in: 'in',
  startswith: 'startsWith',
  endswith: 'endsWith',
  contains: 'contains'
}

type SimpleMatchKeys = keyof typeof simpleMatch

function isNull(v: any) {
  return v === null || v === undefined || v === ''
}

function parseOperatorToGraphQuery(operator: LogicalFilter) {
  if (isNull(operator.value) || (Array.isArray(operator.value) && (!operator.value.length || operator.value.every(isNull)))) {
    return
  }
  if (operator.operator in simpleMatch) {
    return {
      [simpleMatch[operator.operator as SimpleMatchKeys]]: operator.value
    }
  }
  switch (operator.operator) {
    case 'between':
      return {
        // 根据业务决定边界
        gte: operator.value[0],
        lte: operator.value[1]
      }
    // 否定的暂时不做
    // case 'nbetween':
    //   return {
    //     [operator.field]: {
    //       not: {
    //         // 根据业务决定边界
    //         lte: operator.value[0],
    //         gte: operator.value[1]
    //       }
    //     }
    //   }
    default:
      break;
  }
}

export const FireboomDataProvider = (apiUrl: string = '/app/main/operations'): DataProvider => {
  const client = axios.create({
    baseURL: apiUrl, paramsSerializer: {
      serialize(params) {
        return Object.keys(params).reduce<string[]>((arr, key) => {
          const curr = params[key]
          arr.push(`${key}=${JSON.stringify(curr)}`)
          return arr
        }, []).join('&')
      }
    }
  })

  client.interceptors.response.use((resp) => {
    let message
    if (resp.data) {
      message = resp.data.message
    } else {
      message = resp.statusText
    }
    message.error(message)
    return resp
  })

  return {
    async getList({ resource, hasPagination, pagination, metaData, sort, filters }) {
      const params: Record<string, any> = {}
      if (hasPagination) {
        params.take = pagination!.pageSize
        params.skip = pagination!.pageSize! * (pagination!.current! - 1)
      }
      if (sort && sort.length) {
        params.orderBy = sort.map(item => ({ [item.field]: item.order }))
      }
      if (filters && filters.length) {
        params.query = filters.reduce<Record<string, any>>((map, cur) => {
          const filter = cur as LogicalFilter
          map[filter.field] = parseOperatorToGraphQuery(filter)
          return map
        }, {})
      }
      const data = await resolveResp(client.get(`/Get${resource}List`, { params }))
      return data ? data : { total: 0, data: data.data }
    },
    async getMany({ resource, metaData, ids }) {
      const data = await resolveResp(client.get(`/GetMany${resource}`, { params: { ids } }))
      return data ? data.data : []
    },
    async getOne({ id, resource }) {
      const data = await resolveResp(client.get(`/GetOne${resource}`, { params: { id: +id } }))
      return data
    },
    async create({ resource, variables, metaData }) {
      const data = await resolveResp(client.post(`/CreateOne${resource}`, variables))
      return data
    },
    async update({ id, resource, variables, metaData }) {
      const data = await resolveResp(client.post(`/UpdateOne${resource}`, { ...variables, id: +id }))
      return data
    },
    async deleteOne({ id, resource, variables }) {
      const data = await resolveResp(client.post(`/DeleteOne${resource}`, { ...variables, id: +id }))
      return data
    },
    getApiUrl() {
      return client.getUri()
    }
  }
}