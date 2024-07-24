import React, { useState } from 'react'
import {
  Button,
  Input,
  Form,
  message,
  Descriptions,
  Modal,
  // Typography,
} from 'antd'
import styled from 'styled-components'
import { Store } from 'antd/lib/form/interface'
import { getThemeToken } from '../../utils/styles'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: ${getThemeToken('paddingLG', 'px')};
  display: flex;
  justify-content: center;
  align-items: center;
`

const FormWrapper = styled(Form)`
  width: 100%;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const FormItem = styled(Form.Item)`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;

  & > .ant-form-item-label {
    text-align: left;
  }

  & > .ant-form-item-control {
    flex: 1;
  }
`

const SubmitButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

// const ModalContent = styled.div`
//   p {
//     margin: 0 0 10px;
//   }

//   strong {
//     margin-right: 5px;
//   }
// `

interface AssessmentFormValues {
  score: number
  feedback: string
}

const mockSubmit = async (values: AssessmentFormValues): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock data submitted:', values)
      resolve()
    }, 2000)
  })
}

const AssessmentDetail: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState<AssessmentFormValues | null>(
    null
  )

  const showModal = (values: AssessmentFormValues) => {
    Modal.confirm({
      type: 'warning',
      title:
        'You are about to submit the assessment for this group. Are you sure?',
      // content: (
      //   <ModalContent>
      //     <Typography>
      //       <Typography.Text strong>Score:</Typography.Text> {values.score}
      //     </Typography>
      //     <Typography>
      //       <Typography.Text strong>Feedback:</Typography.Text>{' '}
      //       {values.feedback}
      //     </Typography>
      //   </ModalContent>
      // ),
      onOk: async () => {
        setLoading(true)
        try {
          await mockSubmit(values)
          setLoading(false)
          message.success('Score and feedback submitted successfully')
        } catch (error) {
          setLoading(false)
          message.error('Submission failed')
        }
      },
      onCancel() {
        message.info('Submission cancelled')
      },
    })
  }

  const onFinish = (values: AssessmentFormValues) => {
    setFormValues(values)
    showModal(values)
  }

  const onFinishFailed = (errorInfo: Store): void => {
    console.log('data', formValues)
    console.error('Failed:', errorInfo)
    message.error('Please fill in all required fields correctly.')
  }

  return (
    <Wrapper>
      <FormWrapper
        name="assessment"
        onFinish={(values) => onFinish(values as AssessmentFormValues)}
        onFinishFailed={onFinishFailed}
        initialValues={{ score: 0, feedback: '' }}
        layout="vertical"
      >
        <Descriptions bordered title="Assessment for Group" />
        <FormItem
          label="Score"
          name="score"
          rules={[
            { required: true, message: 'Please input the score!' },
            // {
            //   validator: (_, value) => {
            //     if (Number.isInteger(value) && value >= 0 && value <= 100) {
            //       return Promise.resolve()
            //     }
            //     return Promise.reject(
            //       new Error('Score must be between 0 and 100')
            //     )
            //   },
            // },
          ]}
        >
          <Input type="number" />
        </FormItem>

        <FormItem
          label="Feedback"
          name="feedback"
          rules={[{ required: true, message: 'Please provide feedback!' }]}
        >
          <Input.TextArea rows={4} />
        </FormItem>

        <Form.Item>
          <SubmitButtonWrapper>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </SubmitButtonWrapper>
        </Form.Item>
      </FormWrapper>
    </Wrapper>
  )
}

export default AssessmentDetail
