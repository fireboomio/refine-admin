import {
  List,
  Table,
  useTable,
  ShowButton,
  Space
} from '@pankod/refine-antd'
import { arrayToTree } from '@/utils/array'

import { IMenu, IMenuWithChildren } from './interfaces'

export const MenuList = () => {
  const { tableProps: { dataSource, ...restTableProps } } = useTable<IMenu>({ hasPagination: false })

  const treeData = arrayToTree([...(dataSource ?? [])], { dataField: null }) as IMenuWithChildren[]

  return (
      <List title="菜单树">
        <Table {...restTableProps} dataSource={treeData} pagination={false} rowKey="id">
          <Table.Column dataIndex="id" title="ID" />
          <Table.Column dataIndex="label" title="标题" />
          <Table.Column dataIndex="path" title="路径" />
          <Table.Column dataIndex="sort" title="排序" />
          <Table.Column dataIndex="level" title="层级" />
          <Table.Column<IMenu>
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
  )
}
