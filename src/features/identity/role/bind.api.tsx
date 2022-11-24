import { useCustom, useCustomMutation, useList } from '@pankod/refine-core'
import { Avatar, Button, CreateButton, Drawer, Icons, message, Space, Table, Tree } from '@pankod/refine-antd'
import { useEffect, useState } from 'react'
import { IUser } from '../user/interfaces'
import { IApi } from '../permission/interfaces'
import ApiSelection from './api.selection'

interface RoleApiBindProps {
  roleId: number | string
  onClose?: () => void
}

const RoleApiBind = ({ roleId, onClose }: RoleApiBindProps) => {
  const { mutate } = useCustomMutation()

  const [apis, setApis] = useState<IApi[]>([])

  const { data, isLoading } = useList<IApi>({
    dataProviderName: 'proxy',
    resource: 'operateApi',
    config: { hasPagination: false }
  })
  const [checkedApis, setCheckedApis] = useState<number[]>([])

  useEffect(() => {
    setApis(data?.data ?? [])
  }, [data])

  const onSave = () => {
    console.log(checkedApis)
    mutate(
      {
        url: '/xxx',
        method: 'post',
        values: {
          roleId,
          apis: apis.map((item) => item.id),
        },
      },
      {
        onSuccess(resp) {
          if (resp) {
            message.success('关联API已更新')
            onClose?.()
          }
        },
      }
    )
  }

  return (
    <>
      <Tree
        checkable
        // @ts-ignore
        treeData={apis}
        fieldNames={{ key: 'id', title: 'path', children: 'children' }}
        checkedKeys={checkedApis}
        // @ts-ignore
        titleRender={(v: IApi) => `[${v.method}] ${v.path}`}
        // @ts-ignore
        onCheck={v => setCheckedApis(v)}
      />
      {/* <Table<IApi>
        loading={isLoading}
        dataSource={apis}
        rowKey="id"
      >
        <Table.Column dataIndex="path" title="路径" />
        <Table.Column dataIndex="method" title="方法" />
        <Table.Column dataIndex="enable" title="状态" render={v => v ? '已上线' : '已下架'} />
        <Table.Column dataIndex="isPublic" title="是否公开" render={v => v ? '公开' : '内部'} />
        <Table.Column dataIndex="legal" title="校验" render={v => v ? <Icons.CheckCircleFilled /> : <><Icons.WarningFilled />错误</>} />
      </Table> */}
      <Space className="mt-4">
        <Button type="primary" onClick={onSave}>
          保存
        </Button>
        <Button onClick={onClose}>取消</Button>
      </Space>
      {/* <Drawer title="选择API" visible={drawerVisible} onClose={closeDrawer} width={520}>
        {drawerVisible && <ApiSelection roleId={roleId} onClose={closeDrawer} onSelect={v => {
          setApis([...apis, ...v])
        }} />}
      </Drawer> */}
    </>
  )
}

export default RoleApiBind
