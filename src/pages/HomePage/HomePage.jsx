import cx from "classnames";

import s from "./HomePage.module.scss";
import useAxios from "@src/utils/useAxios";
import { useContext, useEffect, useState } from "react";
import { Layout } from "antd";
import SideBar from "@src/components/SideBar";
import AuthContext from "@src/context/AuthContext";
import { Route, Routes } from "react-router-dom";
import Header from "@src/components/Header";
import Attendance from "@src/components/Attendance";
import { QueryClient, QueryClientProvider } from "react-query";
import AttendanceDetail from "@src/components/AttendanceDetail";

const { Content } = Layout;
const queryClient = new QueryClient();

const HomePage = ({ className }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={cx(s.root, className)}>
        <Layout>
          <Header className={s.header} />
          <Layout>
            <SideBar className={s.sideBur} />
            <Content className={s.content}>
              <Routes>
                <Route element={<Attendance />} path='/attendance' />
                <Route element={<AttendanceDetail />} path='/attendance/:id' />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </div>
    </QueryClientProvider>
  );
};

export default HomePage;
