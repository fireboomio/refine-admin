import { useCustom, useCustomMutation, useList } from '@pankod/refine-core'
import { Avatar, Button, CreateButton, Drawer, message, Space, Table } from '@pankod/refine-antd'
import { useMemo, useState } from 'react'
import { mockUsers } from '../mock'
import { IUser } from '../user/interfaces'

interface UserSelectionProps {
  roleId: number | string
  onClose?: () => void
  onSelect?: (users: IUser[]) => void
}

const UserSelection = ({ roleId, onClose, onSelect }: UserSelectionProps) => {

  const [users, setUsers] = useState<IUser[]>(mockUsers)
  const [selections, setSelections] = useState<IUser[]>([])

  const onSubmit = () => {
    onSelect?.(selections)
    onClose?.()
  }

  return (
    <>
      <Table<IUser>
        // loading={isLoading}
        dataSource={users}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selections.map(i => i.id),
          onChange: (v, users) => setSelections(users),
        }}
      >
        <Table.Column dataIndex="avatarUrl" title="头像" render={(value) => <Avatar src={value} size="small" />} />
        <Table.Column dataIndex="name" title="名称" />
        <Table.Column<IUser> dataIndex="provider" title="提供商" render={(v, rec) => `${v}.${rec.providerId}`} />
      </Table>
      <Space className="mt-4">
        <Button type="primary" onClick={onSubmit}>
          保存
        </Button>
        <Button onClick={onClose}>取消</Button>
      </Space>
    </>
  )
}

export default UserSelection