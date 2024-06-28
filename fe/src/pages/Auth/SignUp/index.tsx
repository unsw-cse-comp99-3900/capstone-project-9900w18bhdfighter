import { Button, Flex, Form, Input } from 'antd'
import type { FormProps } from 'antd'
import styled from 'styled-components'
import { getThemeColor as c } from '../../../utils/styles'
import { useAuthContext } from '../../../context/AuthContext'
import { UserSignup } from '../../../types/user'
import { useNavigate } from 'react-router-dom'

const Wrapper = styled(Flex)`
  background-color: ${() => c('grayscalePalette', 2)};
  height: 100vh;
`

type FieldType = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

const SignUp = () => {
  const { signup } = useAuthContext()
  const navigate = useNavigate()
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    const { firstName, lastName, email, password } = values
    const userSignupDto: UserSignup = {
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: email,
      Passwd: password,
    }
    signup(userSignupDto, navigate)
  }
  return (
    <Wrapper vertical justify="center" align="center">
      <Form layout="vertical" onFinish={onFinish} style={{ width: '400px' }}>
        <Form.Item
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
          }}
          label="First name"
          name="firstName"
          rules={[{ required: true, message: 'Please input your first name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
            marginLeft: '16px',
          }}
          label="Last name"
          name="lastName"
          rules={[{ required: true, message: 'Please input your last name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="E-mail address"
          name="email"
          rules={[{ required: true, message: 'Please input your E-mail!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('The password does not match!'))
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button block type="primary" htmlType="submit">
            Confirm
          </Button>
        </Form.Item>
      </Form>
    </Wrapper>
  )
}

export default SignUp
