import useAxios from "@src/utils/useAxios";
import { Card, DatePicker, Descriptions, Select } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Pie } from "@ant-design/plots";

const TeacherProfile = () => {
  const api = useAxios();
  const { user_id } = useParams();
  const [date, setDate] = useState();
  const [subject, setSubject] = useState("Всё");
  const [attendanceType, setAttendanceType] = useState("Всё");

  const getData = useCallback(async () => {
    try {
      console.log(date);
      const response = await api.get(`/api/teacher/${user_id}`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }, [api, user_id, date]);
  const { data, isLoading } = useQuery([`teacherProfile${user_id}`, api, user_id, date], getData, {
    keepPreviousData: true,
  });

  console.log(data);

  const nameItems = useMemo(
    () =>
      !isLoading && [
        {
          key: "1",
          label: "Фамилия",
          children: data?.teacher?.user?.last_name || "-",
        },
        {
          key: "2",
          label: "Имя",
          children: data?.teacher?.user?.first_name || "-",
        },
        {
          key: "3",
          label: "Отчество",
          children: data?.teacher?.user?.middle_name || "-",
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
          children: data?.teacher?.user?.phone || "-",
        },
        {
          key: "2",
          label: "Почта",
          children: data?.teacher?.user?.email || "-",
        },
      ],
    [data, isLoading],
  );

  const studyItems = useMemo(
    () =>
      !isLoading && [
        {
          key: "1",
          label: "Должность",
          children: data?.teacher?.job_title || "-",
        },
        {
          key: "2",
          label: "Звание",
          children: data?.teacher?.scientific_title || "-",
        },
      ],
    [isLoading, data],
  );

  return (
    !isLoading && (
      <div>
        <Card title='Информация о преподавателе'>
          <Descriptions title='ФИО' items={nameItems} />
          <Descriptions title='Контактные данные' items={contactItems} />
          <Descriptions title='Данные' items={studyItems} />
        </Card>
      </div>
    )
  );
};

export default TeacherProfile;
