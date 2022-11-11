import { Create, Form, Input, InputNumber, Select, useForm } from '@pankod/refine-antd'

import { IPet } from './interfaces'

export const PetCreate = () => {
  const { formProps, saveButtonProps } = useForm<IPet>()

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="名称"
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="年龄"
          name="age"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="性别"
          name={'sex'}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            options={[
              { label: '男', value: 1 },
              { label: '女', value: 2 },
            ]}
          />
        </Form.Item>
      </Form>
    </Create>
  )
}
