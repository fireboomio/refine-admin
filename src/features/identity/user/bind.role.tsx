import { useCustom, useCustomMutation, useList } from '@pankod/refine-core'
import { Button, message, Space, Table } from '@pankod/refine-antd'
import { useMemo, useState } from 'react'
import { IRole } from '../role/interfaces'

interface UserRoleBindProps {
  userId: number | string
  onClose?: () => void
}

const UserRoleBind = ({ userId, onClose }: UserRoleBindProps) => {
  const { data, isLoading } = useList({ resource: 'Role', config: { hasPagination: false } })

  const { data: userRoles } = useCustom({
    url: 'GetUserRoles',
    method: 'get',
    config: { query: { userId }}
  })

  const { mutate } = useCustomMutation()

  console.log(userRoles)

  const [selections, setSelections] = useState<React.Key[]>([])

  const roles = useMemo(() => {
    return data?.data ?? []
  }, [data])

  const onSave = () => {
    mutate({
      url: '/xxx',
      method: 'post',
      values: {
        userId,
        roleIds: selections
      }
    }, {
      onSuccess(resp) {
        if (resp) {
          message.success('角色已更新')
          onClose?.()
        }
      }
    })
  }

  return (
    <>
      <Table
        loading={isLoading}
        dataSource={roles}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selections,
          onChange: (v) => setSelections(v),
        }}
        pagination={false}
      >
        <Table.Column dataIndex="code" title="Code" sorter />
        <Table.Column dataIndex="desc" title="备注" />
      </Table>
      <Space className="mt-4">
        <Button type="primary" onClick={onSave}>保存</Button>
        <Button onClick={onClose}>取消</Button>
      </Space>
    </>
  )
}

export default UserRoleBind
