import { useShow } from '@pankod/refine-core'
import { Avatar, RefreshButton, Show, Typography } from '@pankod/refine-antd'
import { IUser } from './interfaces'

const { Title, Text } = Typography

export const UserShow = () => {
  const { queryResult } = useShow()
  const { data, isLoading } = queryResult
  const record = data?.data as IUser

  return (
    <Show isLoading={isLoading} pageHeaderProps={{ extra: <RefreshButton /> }}>
      <Title level={5}>名称</Title>
      <Text>{record?.name}</Text>

      <Title level={5}>头像</Title>
      <Avatar src={record?.avatarUrl} />

      <Title level={5}>提供商</Title>
      <Text>{record?.provider}</Text>
    </Show>
  )
}
