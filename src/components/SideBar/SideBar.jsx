import Sider from "antd/es/layout/Sider";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useContext, useMemo } from "react";
import AuthContext from "@src/context/AuthContext";

const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
};

const SideBar = ({ className }) => {
  const location = useLocation();
  const attendance = location.pathname.startsWith("/attendance") ? ["/attendance"] : [];
  const journal = location.pathname.startsWith("/journal") ? ["/journal"] : [];
  const paperJournal = location.pathname.startsWith("/paperJournal") ? ["/paperJournal"] : [];
  const { user } = useContext(AuthContext);
  const items = useMemo(
    () => [
      getItem(<Link to='/attendance'>Ваши занятия</Link>, "/attendance"),
      getItem(<Link to='/journal'>Журнал по предмету</Link>, "/journal"),
      getItem(
        user.type === "student" ? (
          <Link to={`/paperJournal/${user.group.name}/${user.group.id}`}>Журнал группы</Link>
        ) : (
          <Link to='/paperJournal'>Журнал группы</Link>
        ),
        "/paperJournal",
      ),
      // getItem(<Link to='/calendar'>Календарь</Link>, "/calendar"),
      getItem(<Link to='/students'>Студенты</Link>, "/students"),
      getItem(<Link to='/teachers'>Преподаватели</Link>, "/teachers"),
      getItem(<Link to='/groups'>Группы</Link>, "/groups"),
    ],
    [user],
  );

  return (
    <Sider breakpoint='lg' collapsedWidth='0' className={className}>
      <Menu
        selectedKeys={[...attendance, ...journal, ...paperJournal]}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        theme='dark'
        mode='inline'
        items={items}
      />
    </Sider>
  );
};

export default SideBar;
