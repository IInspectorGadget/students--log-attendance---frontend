import cx from "classnames";

import s from "./Container.module.scss";
import { Divider } from "antd";

const Container = ({ className }) => {
  return <Divider className={cx(s.root, className)}></Divider>;
};

export default Container;
