import { useShow } from '@pankod/refine-core'
import { Avatar, RefreshButton, Show, Typography } from '@pankod/refine-antd'
import { IMenu } from './interfaces'

const { Title, Text } = Typography

export const MenuShow = () => {
  const { queryResult } = useShow()
  const { data, isLoading } = queryResult
  const record = data?.data as IMenu

  return (
    <Show isLoading={isLoading} pageHeaderProps={{ extra: <RefreshButton /> }}>
      <Title level={5}>ID</Title>
      <Text>{record?.id}</Text>

      <Title level={5}>标题</Title>
      <Avatar src={record?.label} />

      <Title level={5}>路径</Title>
      <Text>{record?.path}</Text>
    </Show>
  )
}
