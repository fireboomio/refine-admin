import { useForm, Form, Input, Select, Edit, InputNumber } from '@pankod/refine-antd'
import { IPet } from './interfaces'

export const PostEdit: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<IPet>()

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
    </Edit>
  )
}
