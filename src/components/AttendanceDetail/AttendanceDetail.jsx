import { Breadcrumb, Button, Card, Flex, List, Select, Table, Typography } from "antd";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import useAxios from "@src/utils/useAxios";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import AuthContext from "@src/context/AuthContext";

const AttendanceDetail = ({ isJournal = false, isPaperJournal = false }) => {
  const api = useAxios();
  const { attendance_id, group_id, id, subject, group } = useParams();
  const [currentTab, setCurrentTab] = useState(group_id);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const { user } = useContext(AuthContext);

  const getAttendance = useCallback(async () => {
    try {
      const response = await api.get(`/api/attendanceDetail/${attendance_id}`, { params: {} });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }, [api, attendance_id]);

  const getGroupReports = useCallback(async () => {
    try {
      if (!currentTab) return;
      const response = await api.get(`/api/attendanceDetail/${attendance_id}/${currentTab}`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }, [api, attendance_id, currentTab]);

  const {
    data: attendanceData,
    refetch: attendanceDataRefetch,
    isLoading: isAttendanceLoading,
  } = useQuery([`attendanceDetail${attendance_id}`, api, attendance_id], getAttendance, {
    keepPreviousData: false,
  });

  const {
    data: groupReportData,
    refetch: groupReportRefetch,
    isLoading: isGroupReportLoading,
  } = useQuery([`groupReportData${attendance_id}${group_id}`, api, attendance_id, currentTab], getGroupReports, {
    keepPreviousData: true,
  });

  const sendReport = useCallback(
    async (student_id, type_id) => {
      try {
        await api.post(`/api/attendanceReport/`, {
          student_id: student_id,
          attendance_id: attendance_id,
          status: type_id,
        });
        groupReportRefetch();
      } catch (err) {
        if (err.response.status == 403) {
          alert("У вас не достаточно прав");
        } else {
          alert("Проблема с сервером");
        }
        console.error(err);
      }
    },
    [api, attendance_id, groupReportRefetch],
  );

  const sendChangeComplete = useCallback(async () => {
    try {
      await api.post(`/api/attendanceComplete/${attendance_id}`);
      attendanceDataRefetch();
    } catch (err) {
      if (err.response.status == 403) {
        alert("У вас не достаточно прав");
      } else {
        alert(JSON.parse(err.request.response).message);
      }
      console.error(err);
    }
  }, [api, attendance_id, attendanceDataRefetch]);

  const sendReports = useCallback(async () => {
    try {
      await api.post(`/api/attendanceReports/`, {
        students_id: selectedRowKeys,
        attendance_id: attendance_id,
        status: selectedValue,
      });
      groupReportRefetch();
    } catch (err) {
      if (err.response.status == 403) {
        alert("У вас не достаточно прав");
      } else {
        alert("Проблема с сервером");
      }
      console.error(err);
    }
  }, [api, attendance_id, selectedRowKeys, selectedValue, groupReportRefetch]);

  const getColumns = useCallback(
    () => [
      {
        title: "ФИО",
        dataIndex: "student",
        key: "student",
        fixed: "left",
      },
      {
        title: "Номер зачетки",
        dataIndex: "id",
        key: "id",
        fixed: "left",
      },
      {
        title: "Статус",
        dataIndex: "status",
        key: "status",
      },
      {
        title: "Последнее обновление",
        dataIndex: "refresh_time",
        key: "refresh_time",
      },
    ],
    [],
  );

  const getListData = useCallback(
    () =>
      attendanceData
        ? [
            {
              title: "Преподаватель:",
              text: `${attendanceData.teacher.last_name} ${attendanceData.teacher.first_name} ${attendanceData.teacher.middle_name}`,
            },
            {
              title: "Дисциплина",
              text: `${attendanceData.subject.name}`,
            },
            {
              title: "Тип",
              text: `${attendanceData.type.name}`,
            },
            {
              title: "Группы",
              text: Object.keys(attendanceData.groups).map((key) => <p key={key}>{attendanceData.groups[key].name}</p>),
            },
            {
              title: "Место проведения",
              text: `${attendanceData.location}`,
            },
            {
              title: "Дата",
              text: `${attendanceData.date}`,
            },
            {
              title: "Время",
              text: `${attendanceData.time_start} - ${attendanceData.time_end}`,
            },
            {
              title: "Подтвержден?",
              text: `${attendanceData.isComplete ? "Да" : "Нет"}`,
            },
          ]
        : [],
    [attendanceData],
  );

  const tabList = useMemo(
    () => (attendanceData ? Object.keys(attendanceData.groups).map((key) => ({ key: key, tab: attendanceData.groups[key].name })) : []),
    [attendanceData],
  );

  const createDataSource = useCallback(() => {
    const dataSource = groupReportData?.map((el) => {
      return {
        key: el.id,
        student: `${el.last_name} ${el.first_name} ${el.middle_name}`,
        id: el.id,
        status: (
          <Select
            disabled={!(user.type === "teacher" || user.is_headman === true) || attendanceData?.isComplete}
            value={el.type}
            onSelect={(value) => sendReport(el.id, value)}
            placeholder='-'
            options={[
              {
                value: "1",
                label: "+",
              },
              {
                value: "2",
                label: "Н",
              },
              {
                value: "3",
                label: "П",
              },
              {
                value: "4",
                label: "Б",
              },
            ]}
          />
        ),
        refresh_time: el.last_edit_time,
      };
    });
    return dataSource;
  }, [groupReportData, sendReport, attendanceData, user]);

  const handlerTabChange = useCallback(
    (key) => {
      setCurrentTab(key);
    },
    [setCurrentTab],
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const changeManyFields = () => {
    sendReports();
    groupReportRefetch();
  };

  useEffect(() => {
    if (tabList && !currentTab) setCurrentTab(tabList[0]?.key);
  }, [tabList, currentTab]);

  const getBreadcrumbData = useCallback(() => {
    const items = [];

    items[0] = {
      title: <Link to='/journal'>Журнал</Link>,
    };
    if (user.type === "student") {
      items[1] = {
        title: <Link to={`/journal/${subject}/${id}/${group}/${group_id}`}>{subject}</Link>,
      };
      items[2] = {
        title: "Занятие",
      };
    } else {
      items[1] = {
        title: <Link to={`/journal/${subject}/${id}/`}>{subject}</Link>,
      };
      items[2] = {
        title: <Link to={`/journal/${subject}/${id}/${group}/${group_id}`}>{group}</Link>,
      };
      items[3] = {
        title: "Занятие",
      };
    }
    return items;
  }, [id, group, subject, user, group_id]);

  const getBreadcrumbDataPaper = useCallback(() => {
    const items = [];
    if (user.type === "student") {
      items[0] = {
        title: <Link to={`/paperJournal/${group}/${group_id}`}>Журнал</Link>,
      };
      items[1] = {
        title: "Занятие",
      };
    } else {
      items[0] = {
        title: <Link to='/paperJournal'>Журнал</Link>,
      };
      items[1] = {
        title: <Link to={`/paperJournal/${group}/${group_id}`}>{group}</Link>,
      };
      items[2] = {
        title: "Занятие",
      };
    }
    return items;
  }, [group, user, group_id]);

  return (
    !isAttendanceLoading && (
      <div className='attendanceDetail'>
        {!isJournal && !isPaperJournal && (
          <Breadcrumb
            items={[
              {
                title: <Link to='/attendance'>Ваши занятия</Link>,
              },
              {
                title: attendanceData.subject.name,
              },
            ]}
          />
        )}
        {isJournal && <Breadcrumb items={getBreadcrumbData()} />}
        {isPaperJournal && <Breadcrumb items={getBreadcrumbDataPaper()} />}
        <div className='attendReport'>
          <div className='attendReport-info'>
            <List
              bordered
              dataSource={getListData()}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Typography.Text strong>{item.title}</Typography.Text>}
                    description={<Typography.Paragraph>{item.text}</Typography.Paragraph>}
                  />
                </List.Item>
              )}
            />
          </div>
          <div className='attendReport-table'>
            <Card
              title={
                <Typography.Title style={{ margin: "0" }} level={2}>
                  Посещаемость занятия
                </Typography.Title>
              }
              className={"attendReport-card"}
              activeTabKey={currentTab}
              loading={isAttendanceLoading}
              onTabChange={handlerTabChange}
              tabList={tabList}
            >
              {(user.type === "teacher" || user.is_headman === true) && (
                <Flex gap={20} align='center' style={{ margin: 8 }}>
                  <Typography.Text strong>Установить статус:</Typography.Text>
                  <Select
                    value={selectedValue}
                    onChange={(key) => setSelectedValue(key)}
                    placeholder='-'
                    options={[
                      {
                        value: "1",
                        label: "+",
                      },
                      {
                        value: "2",
                        label: "Н",
                      },
                      {
                        value: "3",
                        label: "П",
                      },
                      {
                        value: "4",
                        label: "Б",
                      },
                    ]}
                  />
                  <Button loading={isGroupReportLoading} type='primary' disabled={!selectedRowKeys.length} onClick={changeManyFields}>
                    Применить
                  </Button>
                </Flex>
              )}
              <Table
                size='small'
                pagination={false}
                rowSelection={!(user.type === "teacher" || user.is_headman === true) || attendanceData?.isComplete ? false : rowSelection}
                scroll={{ x: true }}
                bordered={true}
                columns={getColumns()}
                loading={isGroupReportLoading}
                dataSource={createDataSource(currentTab)}
                isAttendanceLoading={isAttendanceLoading}
              />
              {(user.type === "teacher" || user.is_headman === true) && !attendanceData.isComplete === true && (
                <Button style={{ margin: "10px" }} type='primary' onClick={sendChangeComplete}>
                  Подтвердить
                </Button>
              )}
            </Card>
          </div>
        </div>
      </div>
    )
  );
};

export default AttendanceDetail;
