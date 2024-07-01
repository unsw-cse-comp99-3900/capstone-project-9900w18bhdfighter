import { Button, Flex, Form, Input } from 'antd'
import type { FormProps } from 'antd'
import styled from 'styled-components'
import { getThemeColor as c } from '../../../utils/styles'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../context/AuthContext'
import { UserLogin } from '../../../types/user'

const Wrapper = styled(Flex)`
  background-color: ${() => c('basicBg')};
  height: 100vh;
`
type FieldType = {
  email: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()

  const { login } = useAuthContext()

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    const { email, password } = values
    const userLoginDto: UserLogin = {
      EmailAddress: email,
      Passwd: password,
    }
    login(userLoginDto, navigate)
  }
  return (
    <Wrapper vertical justify="center" align="center">
      <Form layout="vertical" onFinish={onFinish} style={{ width: '300px' }}>
        <Form.Item label="E-mail" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Wrapper>
  )
}

export default Login
