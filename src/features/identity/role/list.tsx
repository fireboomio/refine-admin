import {
  List,
  Table,
  useTable,
  ShowButton,
  Space
} from '@pankod/refine-antd'

import { IRole } from './interfaces'

export const RoleList = () => {
  const { tableProps } = useTable<IRole>({
    hasPagination: false
  })
  
  return (
      <List title="API列表">
        <Table {...tableProps} pagination={false} rowKey="id">
          <Table.Column dataIndex="id" title="ID" />
          <Table.Column dataIndex="code" title="Code" sorter />
          <Table.Column dataIndex="desc" title="备注" />
          <Table.Column<IRole>
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
