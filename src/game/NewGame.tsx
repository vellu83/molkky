import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Form, Input, Slider, Typography, Layout } from 'antd';
import React from 'react';
import fans from './fans.svg';

const { Title } = Typography;

type Props = {
  onGamePointsChangeHandle: Function;
  onFinishHandle: Function;
};

export const NewGame = ({
  onGamePointsChangeHandle,
  onFinishHandle,
}: Props) => {
  return (
    <Layout className='layout' style={{ width: '100%' }}>
      <TitleWrapper>
        <Title>New Game</Title>
      </TitleWrapper>
      <ImageWrapper>
        <img src={fans} alt='logo'></img>
      </ImageWrapper>
      <FormWrapper>
        <StyledForm
          name='dynamic_form_item'
          initialValues={{ remember: true }}
          onFinish={(values) => onFinishHandle(values)}
        >
          <Form.List name='players'>
            {(fields, { add, remove }) => {
              return (
                <div>
                  <PointsWrapper>
                    <Title level={4}>Game Points</Title>
                    <StyledFormItem
                      required={false}
                      key='points'
                    >
                      <Slider
                        min={1}
                        max={100}
                        defaultValue={50}
                        onChange={(value) => onGamePointsChangeHandle(value)}
                      />
                    </StyledFormItem>
                  </PointsWrapper>
                  <PlayersWrapper>
                    <Title level={4}>Players</Title>
                    {fields.map((field, index) => (
                      <StyledFormItem
                        required={false}
                        key={field.key}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message:
                                "Please input player's name or delete this field.",
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder='name' style={{ width: '80%' }} />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className='dynamic-delete-button'
                            style={{ margin: '0 8px' }}
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        ) : null}
                      </StyledFormItem>
                    ))}
                    <Form.Item>
                      <Button
                        type='dashed'
                        onClick={() => {
                          add();
                        }}
                      >
                        <PlusOutlined /> Add player
                      </Button>
                    </Form.Item>
                  </PlayersWrapper>
                </div>
              );
            }}
          </Form.List>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Play
            </Button>
          </Form.Item>
        </StyledForm>
      </FormWrapper>
    </Layout>
  );
};

const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 24px;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 24px;
  height: 100%;
  align-items: center;
`;

const PlayersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 24px;
  align-items: center;
`;

const PointsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 24px;
  align-items: center;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 120px;
`;

const StyledFormItem = styled(Form.Item)`
  min-width: 200px;
  max-width: 400px;
  flex-basis: auto;
  flex-grow: 1;
`;

const StyledForm = styled(Form)`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
