import { List, Table, useTable, NumberField, ShowButton, Space, DeleteButton, EditButton } from '@pankod/refine-antd'

import { IPet } from './interfaces'

export const PetList: React.FC = () => {
  const { tableProps } = useTable<IPet>()
  return (
    <List createButtonProps={{ type: 'primary' }}>
      {/* <CreateButton  /> */}
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="名称" />
        {/* <Table.Column dataIndex="category" title="分类" render={(v) => v.name} /> */}
        <Table.Column dataIndex="age" title="年龄" render={(value) => <NumberField value={value} />} />
        <Table.Column dataIndex="sex" title="性别" render={(value) => (value === 2 ? '女' : '男')} />
        <Table.Column<IPet>
          title="Actions"
          dataIndex="actions"
          render={(_text, record): React.ReactNode => {
            return (
              <Space>
                <ShowButton size="small" recordItemId={record.id} hideText />
                <EditButton size="small" recordItemId={record.id} hideText />
                <DeleteButton size="small" recordItemId={record.id} hideText />
              </Space>
            )
          }}
        />
      </Table>
    </List>
  )
}
