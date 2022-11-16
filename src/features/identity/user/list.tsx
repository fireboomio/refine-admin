import {
  List,
  Table,
  useTable,
  ShowButton,
  Space,
  Card,
  Avatar,
} from '@pankod/refine-antd'
import { HttpError } from '@pankod/refine-core'

import { IUser, IUserFilterVariables } from './interfaces'
import { Filter, onSearch } from './filter'

export const UserList = () => {
  const { tableProps, searchFormProps } = useTable<IUser, HttpError, IUserFilterVariables>({
    onSearch,
  })
  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Card bodyStyle={{ paddingBottom: 0 }}>
        <Filter formProps={searchFormProps} />
      </Card>
      <List title="用户列表">
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="avatarUrl" title="头像" render={(value) => <Avatar src={value} size="small" />} />
          <Table.Column dataIndex="name" title="名称" sorter />
          <Table.Column dataIndex="provider" title="提供商" sorter />
          <Table.Column<IUser>
            title="操作"
            dataIndex="actions"
            render={(_text, record): React.ReactNode => {
              return (
                <Space>
                  <ShowButton size="small" recordItemId={record.id} hideText />
                </Space>
              )
            }}
          />
        </Table>
      </List>
    </Space>
  )
}
