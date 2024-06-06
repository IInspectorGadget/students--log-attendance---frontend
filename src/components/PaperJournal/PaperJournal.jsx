import { Link, useParams } from "react-router-dom";
import useAxios from "@src/utils/useAxios";
import { useQuery } from "react-query";
import { useCallback, useContext, useMemo, useState } from "react";
import { Breadcrumb, Table, DatePicker } from "antd";
import dayjs from "dayjs";
import AuthContext from "@src/context/AuthContext";

const PaperJournal = () => {
  const { group, group_id } = useParams();
  const api = useAxios();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { user } = useContext(AuthContext);

  const getAttendance = useCallback(async () => {
    try {
      const response = await api.get(`/api/journal/${group_id}?year=2024&month=3`, {
        params: {
          year: currentDate.year(),
          month: currentDate.month() + 1,
        },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }, [group_id, api, currentDate]);

  const { data, isLoading } = useQuery([`journal${group_id}`, api, group_id, currentDate], getAttendance, {
    keepPreviousData: true,
  });

  const columns = useMemo(() => {
    if (isLoading) return;
    const columns = [
      {
        title: (
          <DatePicker
            onChange={(date) => {
              setCurrentDate(date);
            }}
            defaultValue={currentDate}
            format={"YYYY/MM"}
            picker='month'
          />
        ),
        children: [
          {
            title: "ФИО Студента",
            dataIndex: "student",
            key: "student",
            fixed: "left",
          },
        ],
      },
    ];
    const dates = Object.keys(data.attendances);
    dates.forEach((date) => {
      const dateData = data.attendances[date];
      const dateColumns = dateData.map((subject) => ({
        title: (
          <Link to={`/paperJournal/${group}/${group_id}/attendance/${subject.id}`}>
            <span style={{ writingMode: "vertical-rl", maxHeight: "200px" }}>{subject.name}</span>
          </Link>
        ),
        dataIndex: subject.id,
        key: subject.id,
        align: "center",
      }));
      columns[0].children.push({
        title: date.split("-")[2],
        children: dateColumns.length ? dateColumns : [{ title: "" }],
        align: "center",
      });
    });
    return columns;
  }, [data, isLoading, currentDate, group, group_id]);

  const dataSource = useMemo(() => {
    if (isLoading) return;
    return data.students.map((el) => {
      return {
        key: el.student.id,
        id: el.student.id,
        student: (
          <Link to={`/student/${el.student.id}`}>
            {el.student.user.last_name} {el.student.user.first_name} {el.student.user.middle_name}
          </Link>
        ),
        ...Object.fromEntries(el.report_row.map((attendance) => [attendance.id, attendance.status])),
      };
    });
  }, [data, isLoading]);

  return (
    <div>
      <Breadcrumb
        items={
          user.type === "student"
            ? [
                {
                  title: <Link to={`/paperJournal/${group}/${group_id}`}>Журнал</Link>,
                },
              ]
            : [
                {
                  title: <Link to='/paperJournal'>Журнал</Link>,
                },
                {
                  title: group,
                },
              ]
        }
      />
      <Table loading={isLoading} dataSource={dataSource} columns={columns} bordered pagination={false} size='small' scroll={{ x: true }} />
    </div>
  );
};

export default PaperJournal;
