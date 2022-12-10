import { useCustom, useCustomMutation, useList } from '@pankod/refine-core'
import { Button, message, Space, Table } from '@pankod/refine-antd'
import { useEffect, useState } from 'react'
import { mutateToPromise } from '@/utils/mutate'

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

  const { mutate, mutateAsync, isLoading: isSaveLoading } = useCustomMutation()

  const [selections, setSelections] = useState<React.Key[]>([])

  useEffect(() => {
    setSelections(userRoles?.data.map(item => item.id))
  }, [userRoles])

  const onSave = async () => {
    try {
      await Promise.all(userRoles?.data.map(role => {
        return mutateAsync({
          url: '/DisconnectOneUserRole',
          method: 'post',
          values: {
            userId,
            roleId: role.id
          }
        })
      }))

      await Promise.all(selections.map(sel => {
        return mutateAsync({
          url: '/ConnectOneUserRole',
          method: 'post',
          values: {
            userId,
            roleId: sel
          }
        })
      }))
      message.success('角色已更新')
      onClose?.()
    } catch (error) {
      console.error(error)
      message.error('更新失败')
    }
  }

  return (
    <>
      <Table
        loading={isLoading}
        dataSource={data?.data ?? []}
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
        <Button type="primary" loading={isSaveLoading} onClick={onSave}>保存</Button>
        <Button onClick={onClose}>取消</Button>
      </Space>
    </>
  )
}

export default UserRoleBind
