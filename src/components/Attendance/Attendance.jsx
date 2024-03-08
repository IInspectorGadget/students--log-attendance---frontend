import cx from "classnames";

import s from "./Attendance.module.scss";
import { Pagination, Table } from "antd";
import { useContext, useState } from "react";
import useAxios from "@src/utils/useAxios";
import AuthContext from "@src/context/AuthContext";
import useSearch from "@src/utils/useSearch";
import useUsersSearch from "@src/utils/useUsersSearch";
import { useQuery } from "react-query";
import useDateSearch from "@src/utils/useDateSearch";
import useTimeSearch from "@src/utils/useTimeSearch";
import { Link } from "react-router-dom";

const Attendance = ({ className }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [currentSort, setCurrentSort] = useState({});
  const [currentFilters, setCurrentFilters] = useState({});

  const [userFilter, setUserFilter] = useState({});

  const { user } = useContext(AuthContext);
  const api = useAxios();

  const getColumnSearchProps = useSearch(currentFilters, setCurrentFilters, setCurrentPage);
  const getColumnUsersSearchProps = useUsersSearch(userFilter, setUserFilter, setCurrentPage);
  const getColumnDateSearchProps = useDateSearch(setCurrentFilters, setCurrentPage);
  const getColumnTimeSearchProps = useTimeSearch(setCurrentFilters, setCurrentPage);

  const getAttendance = async () => {
    try {
      console.log(currentFilters);
      const response = await api.get(`/api/teacher/attendance/${user.user_id}/?page=${currentPage}`, {
        params: {
          sort_field: currentSort?.field,
          sort_order: currentSort?.order,
          ...currentFilters,
          ...userFilter,
        },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  const queryData = useQuery(["attendance", currentPage, currentSort, currentFilters, userFilter], getAttendance, {
    keepPreviousData: true,
  });
  const { data, isLoading } = queryData;
  const dataSource = data?.results?.map((el, idx) => {
    const replacement = user.user_id === el.teacher_replacement && el.teacher.id !== el.teacher_replacement;
    return {
      key: idx,
      id: <Link to={`/attendance/${el.id}`}>открыть</Link>,
      location: el.location,
      date: el.date,
      time_start: el.time_start,
      time_end: el.time_end,
      type: el.type.name,
      teacher: `${el.teacher.last_name} ${el.teacher.first_name} ${el.teacher.middle_name} ${replacement}`,
      subject: el.subject.name,
      groups: Object.keys(el.groups).map((key) => <p key={key}>{el.groups[key].name}</p>),
    };
  });

  const columns = [
    {
      title: "",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      sorter: true,
      align: "center",

      ...getColumnDateSearchProps("date"),
    },
    {
      title: "Время начала",
      dataIndex: "time_start",
      key: "time_start",
      sorter: true,
      align: "center",
      ...getColumnTimeSearchProps("time"),
    },
    {
      title: "Время окончания",
      dataIndex: "time_end",
      key: "time_end",
      sorter: true,
      align: "center",
    },

    {
      title: "Предмет",
      dataIndex: "subject",
      key: "subject",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("subject"),
    },
    {
      title: "Тип",
      dataIndex: "type",
      key: "type",
      sorter: true,
      align: "center",
      ...getColumnSearchProps("type"),
    },
    {
      title: "Место проведения",
      dataIndex: "location",
      key: "location",
      align: "center",
      ...getColumnSearchProps("location"),
    },
    {
      title: "Преподаватель",
      dataIndex: "teacher",
      key: "teacher",
      align: "center",
      ...getColumnUsersSearchProps("teacher"),
    },
    {
      title: "Группы",
      dataIndex: "groups",
      key: "groups",
      align: "center",
      ...getColumnSearchProps("group"),
    },
  ];

  return (
    <div className={cx(s.root, className)}>
      <Table
        size={"small"}
        scroll={{ x: true }}
        bordered
        dataSource={dataSource}
        columns={columns}
        onChange={(pagination, filters, sorter) => {
          setCurrentSort(sorter);
        }}
        loading={isLoading}
        pagination={false}
      />
      <Pagination current={currentPage} onChange={(page) => setCurrentPage(page)} total={data?.count} pageSize={data?.size} />
    </div>
  );
};

export default Attendance;
