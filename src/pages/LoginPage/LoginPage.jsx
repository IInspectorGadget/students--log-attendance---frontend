import cx from "classnames";

import s from "./LoginPage.module.scss";
import { useContext } from "react";
import AuthContext from "@src/context/AuthContext";

import Form from "antd/es/form/Form";
import { Button, Input, Typography } from "antd";

const { Title } = Typography;

const LoginPage = ({ className }) => {
  let { loginUser } = useContext(AuthContext);
  return (
    <div className={cx(s.root, className)}>
      <Title>Вход</Title>
      <Form
        onFinish={loginUser}
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete='on'
      >
        <Form.Item
          label='Имя пользователя'
          name='username'
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Пароль'
          name='password'
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button type='primary' htmlType='submit'>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
