import { List, Table, useTable, NumberField } from '@pankod/refine-antd'

import { IPet } from './interfaces'

export const PetList: React.FC = () => {
  const { tableProps } = useTable<IPet>()
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="名称" />
        <Table.Column dataIndex="category" title="分类" render={(v) => v.name} />
        <Table.Column dataIndex="age" title="年龄" render={(value) => <NumberField value={value} />} />
        <Table.Column dataIndex="sex" title="性别" render={(value) => (value === 'female' ? '女' : '男')} />
      </Table>
    </List>
  )
}