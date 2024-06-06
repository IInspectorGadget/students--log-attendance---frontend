import useAxios from "@src/utils/useAxios";
import { Card, DatePicker, Descriptions, List, Select, Typography } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { Pie } from "@ant-design/plots";

const GroupProfile = () => {
  const api = useAxios();
  const { group_id } = useParams();
  const [date, setDate] = useState();
  const [subject, setSubject] = useState("Всё");
  const [attendanceType, setAttendanceType] = useState("Всё");

  const getData = useCallback(async () => {
    try {
      console.log(date);
      const response = await api.get(`/api/group/${group_id}`, {
        params: {
          start_date: date?.[0] && date?.[0].format("YYYY-MM-DD"),
          end_date: date?.[1] && date?.[1].format("YYYY-MM-DD"),
        },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }, [api, group_id, date]);
  const { data, isLoading } = useQuery([`groupProfile${group_id}`, api, group_id, date], getData, {
    keepPreviousData: true,
  });

  console.log(data);

  const nameItems = useMemo(
    () =>
      !isLoading && [
        {
          key: "1",
          label: "Название",
          children: data?.group?.name || "-",
        },
        {
          key: "2",
          label: "Дата создания",
          children: data?.group?.year || "-",
        },
      ],
    [data, isLoading],
  );

  // Создаем объект для подсчета количества различных status_display для каждого subject_id
  const counts = useMemo(() => {
    const counts = {};
    if (isLoading) return counts;
    data.attendanceReportData.forEach((item) => {
      const { subject: mySubject, subject_id, status_display, attendance_type } = item;
      if ((subject === +subject_id || subject === "Всё") && (attendance_type === attendanceType || attendanceType === "Всё")) {
        counts[status_display] = (counts[status_display] || 0) + 1;
      }
    });
    console.log(counts);
    return counts;
  }, [data, isLoading, subject, attendanceType]);

  const chartData = useMemo(
    () => (!isLoading ? Object.entries(counts).map(([status, count]) => ({ status, count })) : []),
    [isLoading, counts],
  );

  const customLabel = useCallback(
    (_, datum) => (
      <div>
        {datum.status}:{datum.count}
      </div>
    ),
    [],
  );

  const config = {
    appendPadding: 10,
    data: chartData,
    angleField: "count",
    colorField: "status",
    label: {
      text: "count",
      style: {
        fontWeight: "bold",
      },
      render: customLabel,
    },
    legend: {
      color: {
        title: false,
        position: "top",
        rowPadding: 5,
      },
    },
    interactions: [{ type: "element-active" }],
    tooltip: false,
  };

  const selectOption = useMemo(() => {
    const options = [];
    if (isLoading) return options;
    options.push({ value: "Всё", label: "Всё" });
    data.subjects.forEach((item) => {
      options.push({ value: item.id, label: item.name });
    });
    return options;
  }, [data, isLoading]);

  const handlerDateChange = useCallback((dates) => {
    setDate(dates);
  }, []);

  const statisticItems = useMemo(
    () => [
      {
        key: "1",
        label: "Промежуток даты",
        span: 3,
        children: <DatePicker.RangePicker placeholder={["от", "до"]} onChange={handlerDateChange} />,
      },
      {
        key: "2",
        label: "Выбрать предмет",
        span: 3,
        children: (
          <Select
            defaultValue='Все'
            style={{
              width: "300px",
            }}
            onChange={(value) => setSubject(value)}
            options={selectOption}
          />
        ),
      },
      {
        key: "3",
        label: "Выбрать тип",
        children: (
          <Select
            defaultValue='Все'
            style={{
              width: "300px",
            }}
            onChange={(value) => setAttendanceType(value)}
            options={[
              { value: "Всё", label: "Всё" },
              { value: "лекция", label: "Лекция" },
              { value: "практика", label: "Практика" },
            ]}
          />
        ),
      },
    ],
    [selectOption],
  );

  return (
    !isLoading && (
      <div>
        <Card title='Информация о группе'>
          <Descriptions title='Данные группы' items={nameItems} />
          <Descriptions title='Статистика посещаемости' items={statisticItems} />
          <List
            header={<div>Список группы</div>}
            bordered
            dataSource={data?.students}
            renderItem={(item) => (
              <List.Item>
                <Link to={`/student/${item.id}`}>
                  {item.user.last_name} {item.user.first_name} {item.user.middle_name}
                </Link>
              </List.Item>
            )}
          />
          <Pie {...config} />,
        </Card>
      </div>
    )
  );
};

export default GroupProfile;
