import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import {
  AutoComplete,
  Button,
  Form,
  Layout,
  message,
  Slider,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  isAndroid,
  isIOS,
  isMobileSafari,
  isChrome,
} from 'react-device-detect';
import fans from './fans.svg';
import { Player } from './GamePage';

const { Title } = Typography;

type Props = {
  lastPlayers: Player[];
  onGamePointsChangeHandle: Function;
  onFinishHandle: Function;
  pullo:string;
};

export const NewGame = ({
  lastPlayers,
  onGamePointsChangeHandle,
  onFinishHandle,
  pullo
}: Props) => {
  const [numberPlayers, setNumberPlayers] = useState(0);
  const [options, setOptions] = useState<{ value: string }[]>([]);

  useEffect(() => {
    const isPWAInstalled = window.matchMedia('(display-mode: standalone)')
      .matches;
    if (isAndroid && isChrome && !isPWAInstalled) {
      message.info('Tap "Add to home screen" to install the app.');
    }
    if (isIOS && isMobileSafari && !isPWAInstalled) {
      message.info(
        'Tap the Share button and "Add to home screen" to install the app.'
      );
    }
  }, []);

  return (
    <Layout className='layout' style={{ width: '100%' }}>
      <StyledTitle>New Game</StyledTitle>
      <ImageWrapper>
        <img src={pullo} alt='logo' style={{height:100}}></img>
      </ImageWrapper>
      <StyledForm
        name='dynamic_form_item'
        initialValues={{ remember: true }}
        onFinish={(values) => onFinishHandle(values)}
      >
        <Form.List name='players'>
          {(fields, { add, remove }) => {
            return (
              <div>
                <StyledTitle level={4}>Game Points</StyledTitle>
                <StyledFormItem key='points'>
                  <Slider
                    min={1}
                    max={100}
                    defaultValue={50}
                    onChange={(value) => onGamePointsChangeHandle(value)}
                  />
                </StyledFormItem>
                <PlayersWrapper>
                  <Title level={4}>Players</Title>
                  {fields.map((field, index) => (
                    <StyledFormItem required={false} key={field.key}>
                      <Form.Item
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'give a name or delete the field',
                          },
                        ]}
                        noStyle
                      >
                        <StyledInput
                          placeholder='name'
                          options={options}
                          onSearch={(searchText) => {
                            if (searchText.length === 0) {
                              return;
                            }
                            const options = [] as { value: string }[];
                            lastPlayers
                              .filter((p) => p.includes(searchText))
                              .forEach((p) => {
                                options.push({ value: p });
                              });
                            setOptions(options);
                          }}
                        />
                      </Form.Item>
                      {fields.length > 1 && (
                        <StyledMinusCircleOutlined
                          className='dynamic-delete-button'
                          onClick={() => {
                            setNumberPlayers(numberPlayers - 1);
                            remove(field.name);
                          }}
                        />
                      )}
                    </StyledFormItem>
                  ))}
                  <Form.Item>
                    <Button
                      type='dashed'
                      onClick={() => {
                        setNumberPlayers(numberPlayers + 1);
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
          <Button type='primary' htmlType='submit' disabled={numberPlayers < 2}>
            Play
          </Button>
        </Form.Item>
      </StyledForm>
    </Layout>
  );
};

const StyledTitle = styled(Title)`
  display: flex;
  justify-content: center;
  padding-top: 24px;
`;

const PlayersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 24px;
  align-items: center;

  .ant-form-item-control-input-content {
    display: flex;
    align-items: center;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 120px;
`;

const StyledFormItem = styled(Form.Item)`
  display: flex;
  align-items: center;
  min-width: 200px;
  max-width: 400px;
  flex-basis: auto;
  flex-grow: 1;
`;

const StyledForm = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledInput = styled(AutoComplete)`
  width: 100%;
`;

const StyledMinusCircleOutlined = styled(MinusCircleOutlined)`
  margin: 0 8px;
`;
