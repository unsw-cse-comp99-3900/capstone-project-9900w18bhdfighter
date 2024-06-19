import { Button, Flex, Form, Input } from 'antd'
import styled from 'styled-components'
import { getThemeColor as c } from '../../../utils/styles'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import { useNavigate } from 'react-router-dom'

const Wrapper = styled(Flex)`
  background-color: ${() => c('basicBg')};
  height: 100vh;
`

const Login = () => {
  const { msg } = useGlobalComponentsContext()
  const navigate = useNavigate()
  return (
    <Wrapper vertical justify="center" align="center">
      <Form labelCol={{ span: 24 }}>
        <Form.Item label="E-mail" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              msg.success('Login Success')
              navigate('/dashboard')
            }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </Wrapper>
  )
}

export default Login
