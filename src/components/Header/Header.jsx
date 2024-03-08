import cx from "classnames";

import s from "./Header.module.scss";

import { useContext } from "react";
import AuthContext from "@src/context/AuthContext";
import { Header as H } from "antd/es/layout/layout";
import { Typography } from "antd";
import { Flex } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Header = ({ className }) => {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    <H theme='dark' className={cx(s.root, className)}>
      {user && (
        <Flex className={s.container} justify='end' gap={20} align='center'>
          <Flex gap={10}>
            <Text color='white' strong className={s.username}>
              {user.username}
            </Text>
            <LogoutOutlined onClick={logoutUser} />
          </Flex>
        </Flex>
      )}
    </H>
  );
};

export default Header;
