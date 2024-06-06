import { Breadcrumb, Flex, Pagination, Popover, Table, Typography } from "antd";
import { useCallback, useContext, useMemo, useState } from "react";
import useAxios from "@src/utils/useAxios";
import AuthContext from "@src/context/AuthContext";
import useSearch from "@src/utils/useSearch";
import useUsersSearch from "@src/utils/useUsersSearch";
import { useQuery } from "react-query";
import useDateSearch from "@src/utils/useDateSearch";
import useTimeSearch from "@src/utils/useTimeSearch";
import { Link } from "react-router-dom";
import useSelectSearch from "@src/utils/useSelectSearch";

const Attendance = () => {
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
  const getColumnSelectSearchProps = useSelectSearch(setCurrentFilters, setCurrentPage);

  const getAttendance = useCallback(async () => {
    try {
      const response = await api.get(`/api/attendance/?page=${currentPage}`, {
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
  }, [api, currentPage, currentSort, currentFilters, userFilter]);

  const { data, isLoading } = useQuery(["attendance", api, currentPage, currentSort, currentFilters, userFilter], getAttendance, {
    keepPreviousData: true,
  });

  const dataSource = useMemo(
    () =>
      data?.results?.map((el, idx) => {
        const replacement = el.teacher_replacement.id;
        return {
          key: idx,
          id: <Link to={`/attendance/${el.id}`}>открыть</Link>,
          location: el.location,
          date: el.date,
          time_start: el.time_start,
          time_end: el.time_end,
          type: el.type.name,
          isComplete: el.isComplete ? "Да" : "Нет",
          teacher: replacement ? (
            <Popover
              content={`${el.teacher_replacement.last_name} ${el.teacher_replacement.first_name} ${el.teacher_replacement.middle_name}`}
            >
              <Typography.Text type='warning'>{`${el.teacher.last_name} ${el.teacher.first_name} ${el.teacher.middle_name} `}</Typography.Text>
            </Popover>
          ) : (
            `${el.teacher.last_name} ${el.teacher.first_name} ${el.teacher.middle_name} `
          ),
          subject: el.subject.name,
          groups: Object.keys(el.groups).map((key) => <p key={key}>{el.groups[key].name}</p>),
          faculty: el.faculty.name,
        };
      }),
    [data],
  );

  const getColumns = useMemo(() => {
    return [
      {
        title: <Typography.Title level={2}>Список занятий</Typography.Title>,
        children: [
          {
            title: "Журнал",
            dataIndex: "id",
            key: "id",
            align: "center",
            fixed: "left",
          },
          {
            title: "Подтверждено",
            dataIndex: "isComplete",
            key: "isComplete",
            align: "center",
            fixed: "left",
            ...getColumnSelectSearchProps("isComplete"),
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
            ...getColumnTimeSearchProps(),
          },
          {
            title: "Время окончания",
            dataIndex: "time_end",
            key: "time_end",
            sorter: true,
            align: "center",
            ...getColumnTimeSearchProps(true),
          },

          {
            title: "Дисциплина",
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
          {
            title: "Факультет",
            dataIndex: "faculty",
            key: "faculty",
            align: "center",
            sorter: true,
            ...getColumnSearchProps("faculty"),
          },
        ],
      },
    ];
  }, [getColumnSearchProps, getColumnDateSearchProps, getColumnTimeSearchProps, getColumnUsersSearchProps, getColumnSelectSearchProps]);

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: "Ваши занятия",
          },
        ]}
      />
      <Flex gap='small' vertical align='center'>
        <Table
          style={{ width: "100%" }}
          size={"small"}
          scroll={{ x: true }}
          bordered
          dataSource={dataSource}
          columns={getColumns}
          onChange={(pagination, filters, sorter) => {
            setCurrentSort(sorter);
          }}
          loading={isLoading}
          pagination={false}
        />
        <Pagination current={currentPage} onChange={(page) => setCurrentPage(page)} total={data?.count} pageSize={data?.size} />
      </Flex>
    </div>
  );
};

export default Attendance;
