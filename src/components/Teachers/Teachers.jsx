import useAxios from "@src/utils/useAxios";
import useSearch from "@src/utils/useSearch";
import useSelectSearch from "@src/utils/useSelectSearch";
import { Flex, Pagination, Popover, Table, Typography } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

const Teachers = () => {
  const api = useAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState({});
  const [currentFilters, setCurrentFilters] = useState({});
  const getColumnSearchProps = useSearch(currentFilters, setCurrentFilters, setCurrentPage);
  const getColumnSelectSearchProps = useSelectSearch(setCurrentFilters, setCurrentPage);

  const getStudents = useCallback(async () => {
    try {
      const response = await api.get(`/api/teachers/?page=${currentPage}`, {
        params: {
          sort_field: currentSort?.field,
          sort_order: currentSort?.order,
          ...currentFilters,
        },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }, [api, currentPage, currentSort, currentFilters]);

  const { data, isLoading } = useQuery(["teachers", api, currentPage, currentSort, currentFilters], getStudents, {
    keepPreviousData: true,
  });

  console.log(data);

  const dataSource = useMemo(
    () =>
      data?.results?.map((el, idx) => {
        return {
          key: idx,
          id: <Link to={`/teacher/${el.id}/`}>открыть</Link>,
          last_name: el.user.last_name,
          first_name: el.user.first_name,
          middle_name: el.user.middle_name,
          scientific_title: el.scientific_title,
          job_title: el.job_title,
        };
      }),
    [data],
  );
  const getColumns = useMemo(() => {
    return [
      {
        title: <Typography.Title level={2}>Список преподавателей</Typography.Title>,
        children: [
          {
            title: "Профиль",
            dataIndex: "id",
            key: "id",
            align: "center",
            fixed: "left",
          },
          {
            title: "Фамилия",
            dataIndex: "last_name",
            key: "last_name",
            align: "center",
            sorter: true,
            fixed: "left",
            ...getColumnSearchProps("last_name"),
          },
          {
            title: "Имя",
            dataIndex: "first_name",
            key: "first_name",
            sorter: true,
            align: "center",
            ...getColumnSearchProps("first_name"),
          },
          {
            title: "Отчество",
            dataIndex: "middle_name",
            key: "middle_name",
            sorter: true,
            align: "center",
            ...getColumnSearchProps("middle_name"),
          },
          {
            title: "Должность",
            dataIndex: "job_title",
            key: "job_title",
            sorter: true,
            align: "center",
            ...getColumnSearchProps("job_title"),
          },
          {
            title: "Звание",
            dataIndex: "scientific_title",
            key: "scientific_title",
            sorter: true,
            align: "center",
            ...getColumnSearchProps("scientific_title"),
          },
        ],
      },
    ];
  }, [getColumnSearchProps]);

  return (
    <div>
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

export default Teachers;
