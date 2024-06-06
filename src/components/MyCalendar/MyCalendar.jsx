import useAxios from "@src/utils/useAxios";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { Calendar, Flex, Popover, Typography } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import IsSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(IsSameOrBefore);
dayjs.extend(isBetween);

const MyCalendar = () => {
  const api = useAxios();
  const [currentDate, setCurrentDate] = useState(dayjs());

  const getAttendance = useCallback(async () => {
    try {
      const response = await api.get(`/api/attendanceDate/`, {
        params: {
          date_start: "2014-04-02",
          date_end: "2025-04-02",
        },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }, [api]);

  const { data, isLoading } = useQuery(["attendance", api], getAttendance, {
    keepPreviousData: true,
  });

  const dateCellRender = (date) => {
    if (isLoading) return;
    const attendances = data.filter((attendance) => {
      return date.isSame(attendance.date, "day");
    });

    return (
      <div>
        <ul>
          {attendances.map((attendance) => (
            <li className='calendarItem' key={attendance.id} onClick={() => {}}>
              <Popover className='popover' content={attendance.description}>
                <Flex vertical>
                  <Typography.Text type='warning'>{attendance.subject.name}</Typography.Text>
                  <Typography.Text type='success'>
                    {attendance.time_start}-{attendance.time_end}
                  </Typography.Text>
                </Flex>
              </Popover>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className='myCalendar'>
      <Calendar className='myCalendar' cellRender={dateCellRender} value={currentDate} onChange={(date) => setCurrentDate(date)} />
    </div>
  );
};

export default MyCalendar;
