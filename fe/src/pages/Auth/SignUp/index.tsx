import { Button, Flex, Form, Input } from 'antd'
import styled from 'styled-components'
import { getThemeColor as c } from '../../../utils/styles'

const Wrapper = styled(Flex)`
  background-color: ${() => c('grayscalePalette', 2)};
  height: 100vh;
`

const SignUp = () => {
  return (
    <Wrapper vertical justify="center" align="center">
      <Form labelCol={{ span: 24 }} size="small">
        <Form.Item label="First name" name="firstName">
          <Input />
        </Form.Item>
        <Form.Item label="Last name" name="lastName">
          <Input />
        </Form.Item>
        <Form.Item label="E-mail address" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>
        <Form.Item label="Confirm password" name="confirmPassword">
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Next
          </Button>
        </Form.Item>
      </Form>
    </Wrapper>
  )
}

export default SignUp
