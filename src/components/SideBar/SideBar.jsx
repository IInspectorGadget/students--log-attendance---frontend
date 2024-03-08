import cx from "classnames";

import s from "./SideBar.module.scss";
import Sider from "antd/es/layout/Sider";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
};
const items = [
  getItem(<Link to='/attendance'>Ваши занятия</Link>, "1"),
  getItem(<Link>Посещаемость</Link>, "2"),
  getItem(<Link>Группы</Link>, "3"),
  getItem(<Link>Предметы</Link>, "4"),
  getItem("Navigation One", "sub1", null, [
    getItem("Option 5", "5"),
    getItem("Option 6", "6"),
    getItem("Option 7", "7"),
    getItem("Option 8", "8"),
  ]),
  getItem("Navigation Two", "sub2", null, [
    getItem("Option 9", "9"),
    getItem("Option 10", "10"),
    getItem("Submenu", "sub3", null, [getItem("Option 11", "11"), getItem("Option 12", "12")]),
  ]),
];

const SideBar = ({ className }) => {
  return (
    <Sider collapsed={false} className={cx(className, s.root)}>
      <Menu defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} theme='dark' mode='inline' items={items} />
    </Sider>
  );
};

export default SideBar;
