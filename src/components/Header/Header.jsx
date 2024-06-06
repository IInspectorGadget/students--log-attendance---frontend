import { useContext } from "react";
import AuthContext from "@src/context/AuthContext";
import { Header as H } from "antd/es/layout/layout";
import { Typography } from "antd";
import { Flex } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Header = ({ className }) => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <H theme='dark' className={className}>
      {user && (
        <Flex className='header-container' justify='end' gap={20} align='center'>
          <Flex gap={10}>
            <Text color='white' strong className='header-username'>
              {`${user.last_name} ${user.first_name} ${user.middle_name}`}
            </Text>
            <LogoutOutlined onClick={logoutUser} />
          </Flex>
        </Flex>
      )}
    </H>
  );
};

export default Header;
