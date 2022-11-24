import { useCustom, useCustomMutation, useList } from '@pankod/refine-core'
import { Avatar, Button, CreateButton, Drawer, message, Space, Table } from '@pankod/refine-antd'
import { useMemo, useState } from 'react'
import { IRole } from '../role/interfaces'
import { mockRoles, mockUsers } from '../mock'
import { IUser } from '../user/interfaces'
import UserSelection from './user.selection'

interface RoleUserBindProps {
  roleId: number | string
  onClose?: () => void
}

const RoleUserBind = ({ roleId, onClose }: RoleUserBindProps) => {
  // const { data, isLoading } = useList({ resource: 'Role', config: { hasPagination: false } })

  // const { data: userRole } = useCustom({
  //   url: 'GetRoleUsers',
  //   method: 'get',
  //   config: { query: { roleId }}
  // })
  const [drawerVisible, setDrawerVisible] = useState(false)
  const { mutate } = useCustomMutation()

  const [users, setUsers] = useState<IUser[]>([mockUsers[0], mockUsers[2]])

  // const roles = useMemo(() => {
  //   return data?.data ?? []
  // }, [data])

  const onSave = () => {
    mutate(
      {
        url: '/xxx',
        method: 'post',
        values: {
          roleId,
          userIds: users.map((item) => item.id),
        },
      },
      {
        onSuccess(resp) {
          if (resp) {
            message.success('关联用户已更新')
            onClose?.()
          }
        },
      }
    )
  }

  const closeDrawer = () => {
    setDrawerVisible(false)
  }

  return (
    <>
      <CreateButton type="primary" className="mb-4" onClick={() => setDrawerVisible(true)}>
        添加
      </CreateButton>
      <Table<IUser>
        // loading={isLoading}
        dataSource={users}
        rowKey="id"
      >
        <Table.Column dataIndex="avatarUrl" title="头像" render={(value) => <Avatar src={value} size="small" />} />
        <Table.Column dataIndex="name" title="名称" />
        <Table.Column<IUser> dataIndex="provider" title="提供商" render={(v, rec) => `${v}.${rec.providerId}`} />
      </Table>
      <Space className="mt-4">
        <Button type="primary" onClick={onSave}>
          保存
        </Button>
        <Button onClick={onClose}>取消</Button>
      </Space>
      <Drawer title="选择用户" visible={drawerVisible} onClose={closeDrawer} width={520}>
        {drawerVisible && <UserSelection roleId={roleId} onClose={closeDrawer} onSelect={v => {
          setUsers([...users, ...v])
        }} />}
      </Drawer>
    </>
  )
}

export default RoleUserBind
