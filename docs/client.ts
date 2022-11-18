import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const _internalClient = axios.create({
  baseURL: 'http://localhost:9991/app/main/operations'
})

const _fireboomClient = axios.create({
  baseURL: 'http://localhost:9123/api/v1'
})

export type InternalClientReturn<TData> = {
  data: TData,
  success: true
} | {
  data: null,
  success: false,
  message: string,
  status: number
}

function createClient(clientInstance: AxiosInstance) {
  return async function client<TData = any>(args: AxiosRequestConfig): Promise<InternalClientReturn<TData>> {
    try {
      const { data, status } = await clientInstance(args)
      if (status < 300 && status >= 200) {
        return {
          data: data as TData,
          success: true
        }
      }
      return {
        data: null,
        success: false,
        status,
        message: data.message
      }
    } catch (error) {
      return {
        data: null,
        success: false,
        status: 500,
        message: (error as any).message || error
      }
    }
  }
}

export const internalClient = createClient(_internalClient)
export const fireboomClient = createClient(_fireboomClient)