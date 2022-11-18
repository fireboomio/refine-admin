import { useShow } from '@pankod/refine-core'
import { Avatar, RefreshButton, Show, Typography } from '@pankod/refine-antd'
import { IRole } from './interfaces'

const { Title, Text } = Typography

export const RoleShow = () => {
  const { queryResult } = useShow()
  const { data, isLoading } = queryResult
  const record = data?.data as IRole

  return (
    <Show isLoading={isLoading} pageHeaderProps={{ extra: <RefreshButton /> }}>
      <Title level={5}>ID</Title>
      <Text>{record?.id}</Text>

      <Title level={5}>Code</Title>
      <Avatar src={record?.code} />

      <Title level={5}>备注</Title>
      <Text>{record?.desc}</Text>
    </Show>
  )
}
