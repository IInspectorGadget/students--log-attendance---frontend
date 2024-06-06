import { Layout } from "antd";
import SideBar from "@src/components/SideBar";
import { Route, Routes } from "react-router-dom";
import Header from "@src/components/Header";
import Attendance from "@src/components/Attendance";
import { QueryClient, QueryClientProvider } from "react-query";
import AttendanceDetail from "@src/components/AttendanceDetail";
import Subjects from "@src/components/Subjects";
import Groups from "@src/components/Groups";
import Journal from "@src/components/Journal";
import PaperJournal from "@src/components/PaperJournal";
import MyCalendar from "@src/components/MyCalendar";
import StudentProfile from "@src/components/StudentProfile";
import Students from "@src/components/Students";
import GroupProfile from "@src/components/GroupProfile";
import Teachers from "@src/components/Teachers";
import TeacherProfile from "@src/components/TeacherProfile";
import GroupsList from "@src/components/GroupsList";

const { Content } = Layout;
const queryClient = new QueryClient();

const HomePage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='timeTable'>
        <Layout>
          <Header className='header' />
          <Layout>
            <SideBar className='sideBur' />
            <Content className='content'>
              <Routes>
                <Route element={<Attendance />} path='/attendance' />
                <Route element={<AttendanceDetail />} path='/attendance/:attendance_id' />

                <Route element={<Subjects />} path='/journal' />
                <Route element={<Groups />} path='/journal/:subject/:id' />
                <Route element={<Journal />} path='/journal/:subject/:id/:group/:group_id' />
                <Route element={<AttendanceDetail isJournal />} path='/journal/:subject/:id/:group/:group_id/attendance/:attendance_id' />

                <Route element={<Groups />} path='/paperJournal' />
                <Route element={<PaperJournal />} path='/paperJournal/:group/:group_id' />
                <Route element={<AttendanceDetail isPaperJournal />} path='/paperJournal/:group/:group_id/attendance/:attendance_id' />

                <Route element={<MyCalendar />} path='/calendar' />

                <Route element={<StudentProfile />} path='/student/:user_id' />
                <Route element={<TeacherProfile />} path='/teacher/:user_id' />
                <Route element={<GroupProfile />} path='/group/:group_id' />

                <Route element={<Students />} path='/students' />
                <Route element={<Teachers />} path='/teachers' />
                <Route element={<GroupsList />} path='/groups' />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </div>
    </QueryClientProvider>
  );
};

export default HomePage;
