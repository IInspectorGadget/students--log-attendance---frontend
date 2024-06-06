import { Breadcrumb, Table, Typography } from "antd";
import { useCallback, useContext, useState } from "react";
import useAxios from "@src/utils/useAxios";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import AuthContext from "@src/context/AuthContext";

const Journal = () => {
  const [currentSort, setCurrentSort] = useState({});
  const { id, group_id, subject, group } = useParams();
  const api = useAxios();
  const { user } = useContext(AuthContext);

  const getAttendance = async () => {
    try {
      const response = await api.get(`/api/groups/${id}/${group_id}`, {
        params: {
          sort_field: currentSort?.field,
          sort_order: currentSort?.order,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  const { data, isLoading } = useQuery([`journal${group_id}`, api, id, group_id, currentSort], getAttendance, {
    keepPreviousData: true,
  });

  const getDataSource = useCallback(() => {
    if (isLoading && !data) return;
    return data.students.map((el) => {
      return {
        key: el.student.id,
        id: el.student.id,
        student: `${el.student.user.last_name} ${el.student.user.first_name} ${el.student.user.middle_name}`,
        ...Object.fromEntries(el.report_row.map((attendance) => [attendance.id, attendance.status])),
      };
    });
  }, [data, isLoading]);

  const getColumns = useCallback(() => {
    if (isLoading) return;

    return [
      {
        title: (
          <Typography.Title style={{ margin: 0 }} level={2}>
            Журнал &laquo;{group}&raquo; группы <br /> по дисциплине &laquo;{subject}&raquo;
          </Typography.Title>
        ),
        children: [
          {
            children: [
              {
                children: [
                  {
                    title: "ФИО Студента",
                    dataIndex: "student",
                    key: "student",
                    fixed: "left",
                  },
                ],
              },
            ],
          },
          ...data.attendances.map((attendance) => ({
            title: <Link to={`/journal/${subject}/${id}/${group}/${group_id}/attendance/${attendance.id}`}>{attendance.type}</Link>,
            children: [
              {
                title: attendance.date,
                children: [
                  {
                    dataIndex: attendance.id,
                    key: attendance.id,
                    title: `${attendance.time_start} - ${attendance.time_end}`,
                  },
                ],
              },
            ],
          })),
        ],
      },
    ];
  }, [data, id, group_id, group, subject, isLoading]);

  const getBreadcrumbData = useCallback(() => {
    const items = [];
    items[0] = {
      title: <Link to='/journal'>Журнал</Link>,
    };
    if (user.type === "student") {
      items[1] = {
        title: subject,
      };
    } else {
      items[1] = {
        title: <Link to={`/journal/${subject}/${id}/`}>{subject}</Link>,
      };
      items[2] = {
        title: group,
      };
    }
    return items;
  }, [id, group, subject, user]);

  return (
    <div>
      <Breadcrumb items={getBreadcrumbData()} />
      <Table
        size={"large"}
        scroll={{ x: true }}
        bordered
        dataSource={getDataSource()}
        columns={getColumns()}
        onChange={(pagination, filters, sorter) => {
          setCurrentSort(sorter);
        }}
        loading={isLoading}
        pagination={false}
      />
    </div>
  );
};
export default Journal;
