import useAxios from "@src/utils/useAxios";
import { Card, DatePicker, Descriptions, Select } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Pie } from "@ant-design/plots";

const StudentProfile = () => {
  const api = useAxios();
  const { user_id } = useParams();
  const [date, setDate] = useState();
  const [subject, setSubject] = useState("Всё");
  const [attendanceType, setAttendanceType] = useState("Всё");

  const getData = useCallback(async () => {
    try {
      console.log(date);
      const response = await api.get(`/api/student/${user_id}`, {
        params: {
          start_date: date?.[0] && date?.[0].format("YYYY-MM-DD"),
          end_date: date?.[1] && date?.[1].format("YYYY-MM-DD"),
        },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }, [api, user_id, date]);
  const { data, isLoading } = useQuery([`userProfile${user_id}`, api, user_id, date], getData, {
    keepPreviousData: true,
  });

  console.log(data);

  const nameItems = useMemo(
    () =>
      !isLoading && [
        {
          key: "1",
          label: "Фамилия",
          children: data?.student?.user?.last_name || "-",
        },
        {
          key: "2",
          label: "Имя",
          children: data?.student?.user?.first_name || "-",
        },
        {
          key: "3",
          label: "Отчество",
          children: data?.student?.user?.middle_name || "-",
        },
      ],
    [data, isLoading],
  );

  const contactItems = useMemo(
    () =>
      !isLoading && [
        {
          key: "1",
          label: "Телефон",
          children: data?.student?.user?.phone || "-",
        },
        {
          key: "2",
          label: "Почта",
          children: data?.student?.user?.email || "-",
        },
      ],
    [data, isLoading],
  );

  const studyItems = useMemo(
    () =>
      !isLoading && [
        {
          key: "1",
          label: "Факультет",
          children: data?.student?.group?.faculty || "-",
        },
        {
          key: "2",
          label: "Направление",
          children: data?.student?.group?.course || "-",
        },
        {
          key: "3",
          label: "Группа",
          children: data?.student?.group?.name || "-",
        },
        {
          key: "4",
          label: "Староста",
          children: data?.student?.isHeadman ? "Да" : "Нет",
        },
      ],
    [isLoading, data],
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
    console.log(dates);
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
    [selectOption, handlerDateChange],
  );

  return (
    !isLoading && (
      <div>
        <Card title='Информация о студенте'>
          <Descriptions title='ФИО' items={nameItems} />
          <Descriptions title='Контактные данные' items={contactItems} />
          <Descriptions title='Данные об учебе' items={studyItems} />
          <Descriptions title='Статистика посещаемости' items={statisticItems} />
          <Pie {...config} />,
        </Card>
      </div>
    )
  );
};

export default StudentProfile;
