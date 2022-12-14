import { useCustomMutation, useList } from '@pankod/refine-core'
import { Button, message, Space, Tree } from '@pankod/refine-antd'
import { Key, useEffect, useState } from 'react'
import { IApi } from '../permission/interfaces'

interface RoleApiBindProps {
  roleCode: number | string
  onClose?: () => void
}

const RoleApiBind = ({ roleCode, onClose }: RoleApiBindProps) => {
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
    mutate(
      {
        url: '/xxx',
        method: 'post',
        values: {
          roleCode,
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

  const onSelect = (v: Key[]) => {
    const item = v[0] as number
    if (item) {
      const clone = [...checkedApis]
      const index = checkedApis.indexOf(item)
      if (index > -1) {
        clone.splice(index, 1)
      } else {
        clone.push(item)
      }
      setCheckedApis(clone)
    }
  }

  return (
    <>
      <Tree
        checkable
        // @ts-ignore
        treeData={apis}
        fieldNames={{ key: 'id', title: 'path', children: 'children' }}
        checkedKeys={checkedApis}
        onSelect={onSelect}
        // @ts-ignore
        titleRender={(v: IApi) => `[${v.method}] ${v.path}`}
        // @ts-ignore
        onCheck={v => setCheckedApis(v)}
      />
      <Space className="mt-4">
        <Button type="primary" loading={isLoading} onClick={onSave}>
          保存
        </Button>
        <Button onClick={onClose}>取消</Button>
      </Space>
    </>
  )
}

export default RoleApiBind
