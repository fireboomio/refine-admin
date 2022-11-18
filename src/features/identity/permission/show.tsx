import { useShow } from '@pankod/refine-core'
import { Avatar, RefreshButton, Show, Typography } from '@pankod/refine-antd'
import { IApi } from './interfaces'

const { Title, Text } = Typography

export const ApiShow = () => {
  const { queryResult } = useShow()
  const { data, isLoading } = queryResult
  const record = data?.data as IApi

  return (
    <Show isLoading={isLoading} pageHeaderProps={{ extra: <RefreshButton /> }}>
      <Title level={5}>ID</Title>
      <Text>{record?.id}</Text>

      <Title level={5}>路径</Title>
      <Avatar src={record?.path} />

      <Title level={5}>方法</Title>
      <Text>{record?.method}</Text>
    </Show>
  )
}
