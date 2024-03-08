import { Button, Card, Col, Flex, List, Row, Select, Table, Typography } from "antd";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "@src/context/AuthContext";
import useAxios from "@src/utils/useAxios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import "./AttendanceDetail.scss";

const AttendanceDetail = () => {
  const { user } = useContext(AuthContext);
  const api = useAxios();
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState(null);
  const [currentChangedRowData, setCurrentChangedRowData] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  const getAttendance = useCallback(async () => {
    try {
      const response = await api.get(`/api/teacher/attendanceDetail/${id}/`, {
        params: {
          // sort_field: currentSort?.field,
          // sort_order: currentSort?.order,
          // ...currentFilters,
          // ...userFilter,
        },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }, [api, id]);

  const queryData = useQuery(["attendanceDetail"], getAttendance, {
    keepPreviousData: true,
  });
  const { data, isLoading } = queryData;

  const sendReport = useCallback(
    async (student_id, type_id) => {
      try {
        const response = await api.post(`/api/teacher/attendanceReport/`, {
          student_id: student_id,
          attendance_id: id,
          status: type_id,
        });
        setCurrentChangedRowData(response.data);
      } catch (err) {
        if (err.response.status == 403) {
          alert("У вас не достаточно прав");
        } else {
          alert("Проблема с сервером");
        }
        console.error(err);
      }
    },
    [api, id],
  );

  const columns = useMemo(
    () => [
      {
        title: "ФИО",
        dataIndex: "student",
        key: "student",
      },
      {
        title: "Номер зачетки",
        dataIndex: "id",
        key: "id",
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

  const listData = useMemo(
    () =>
      data
        ? [
            {
              title: "Преподаватель:",
              text: `${data.teacher.last_name} ${data.teacher.first_name} ${data.teacher.middle_name}`,
            },
            {
              title: "Предмет",
              text: `${data.subject.name}`,
            },
            {
              title: "Тип",
              text: `${data.type.name}`,
            },
            {
              title: "Группы",
              text: Object.keys(data.groups).map((key) => <p key={key}>{data.groups[key].name}</p>),
            },
            {
              title: "Место проведения",
              text: `${data.location}`,
            },
            {
              title: "Дата",
              text: `${data.date}`,
            },
            {
              title: "Время",
              text: `${data.time_start} - ${data.time_end}`,
            },
          ]
        : [],
    [data],
  );

  const tabList = useMemo(() => (data ? Object.keys(data.groups).map((key) => ({ key: key, tab: data.groups[key].name })) : []), [data]);

  const createDataSource = () => {
    if (!currentTab) return [];
    const group = data.groups[Object.keys(data.groups).filter((key) => key === currentTab)[0]];
    const dataSource = group.students.map((el) => {
      console.log(currentChangedRowData, el.id);
      return {
        key: el.id,
        student: `${el.last_name} ${el.first_name} ${el.middle_name}`,
        id: el.id,
        status: (
          <Select
            defaultValue={el.type}
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
        refresh_time: el.id === currentChangedRowData?.student_id ? currentChangedRowData.last_edit_time : el.last_edit_time,
      };
    });
    return dataSource;
  };

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
    rowSelection.selectedRowKeys.forEach((user_id) => {
      sendReport(user_id, selectedValue);
    });
  };

  useEffect(() => {
    if (tabList) setCurrentTab(tabList[0]?.key);
  }, [tabList]);

  return (
    !isLoading && (
      <div className='attendanceDetail'>
        <Row>
          <Col flex='200px'>
            <List
              bordered
              dataSource={listData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Typography.Text strong>{item.title}</Typography.Text>}
                    description={<Typography.Paragraph>{item.text}</Typography.Paragraph>}
                  />
                </List.Item>
              )}
            />
          </Col>
          <Col flex='auto'>
            <Card
              className={"card"}
              style={{ padding: "0" }}
              activeTabKey={currentTab}
              loading={isLoading}
              onTabChange={handlerTabChange}
              tabList={tabList}
            >
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
                <Button type='primary' disabled={!selectedRowKeys.length} onClick={changeManyFields}>
                  Применить
                </Button>
              </Flex>

              <Table
                rowSelection={rowSelection}
                bordered={true}
                columns={columns}
                dataSource={createDataSource(currentTab)}
                isLoading={isLoading}
              />
            </Card>
          </Col>
        </Row>
      </div>
    )
  );
};

export default AttendanceDetail;
