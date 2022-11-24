import { useCustomMutation } from '@pankod/refine-core'
import { Button, message, Space, Tree } from '@pankod/refine-antd'
import { useState } from 'react'
import { IMenu } from '../menu/interfaces'
import { mockMenus } from '../mock'
import { arrayToTree } from '@/utils/array'

interface RoleMenuBindProps {
  roleId: number | string
  onClose?: () => void
}

const RoleMenuBind = ({ roleId, onClose }: RoleMenuBindProps) => {
  const { mutate } = useCustomMutation()

  const [menus, setMenus] = useState<IMenu[]>(mockMenus)
  
  const menusMap = menus.reduce<Record<number, IMenu>>((obj, item) => {
    obj[item.id] = item
    return obj
  }, {})
  
  const treeData = arrayToTree(menus)

  const [checkedMenus, setCheckedMenus] = useState<number[]>([mockMenus[1].id, mockMenus[2].id])

  const onSave = () => {
    console.log(checkedMenus)
    mutate(
      {
        url: '/xxx',
        method: 'post',
        values: {
          roleId,
          menus: menus.map((item) => item.id),
        },
      },
      {
        onSuccess(resp) {
          if (resp) {
            message.success('关联菜单已更新')
            onClose?.()
          }
        },
      }
    )
  }

  const onCheck = ({ checked, halfChecked }: {
    checked: number[];
    halfChecked: number[];
  }) => {
    for (const id of checked) {
      let item = menusMap[id]
      while(item.parentId) {
        if (!checked.includes(item.parentId)) {
          checked.push(item.parentId)
        }
        item = menusMap[item.parentId]
      }
    }
    setCheckedMenus(checked)
  }

  return (
    <>
      <Tree
        checkable
        checkStrictly
        treeData={treeData}
        fieldNames={{ key: 'id', title: 'label', children: 'children' }}
        checkedKeys={checkedMenus}
        // @ts-ignore
        onCheck={onCheck}
      />
      <Space className="mt-4">
        <Button type="primary" onClick={onSave}>
          保存
        </Button>
        <Button onClick={onClose}>取消</Button>
      </Space>
    </>
  )
}

export default RoleMenuBind
