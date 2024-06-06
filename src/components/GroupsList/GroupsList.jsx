import useAxios from "@src/utils/useAxios";
import useSearch from "@src/utils/useSearch";
import useSelectSearch from "@src/utils/useSelectSearch";
import { Flex, Pagination, Popover, Table, Typography } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

const GroupList = () => {
  const api = useAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState({});
  const [currentFilters, setCurrentFilters] = useState({});
  const getColumnSearchProps = useSearch(currentFilters, setCurrentFilters, setCurrentPage);
  const getColumnSelectSearchProps = useSelectSearch(setCurrentFilters, setCurrentPage);

  const getStudents = useCallback(async () => {
    try {
      const response = await api.get(`/api/groups/?page=${currentPage}`, {
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

  const { data, isLoading } = useQuery(["groups", api, currentPage, currentSort, currentFilters], getStudents, {
    keepPreviousData: true,
  });

  console.log(data);

  const getDataSource = useCallback(
    () =>
      data?.results?.map((el) => {
        return {
          key: el.id,
          id: <Link to={`/group/${el.id}/`}>открыть</Link>,
          name: el.name,
          course: el.course,
          faculty: el.faculty,
          year: el.year,
        };
      }),
    [data],
  );
  const getColumns = useCallback(
    () => [
      {
        title: (
          <Typography.Title style={{ margin: 0 }} level={2}>
            Список Групп
          </Typography.Title>
        ),
        children: [
          {
            title: "Профиль",
            dataIndex: "id",
            key: "id",
            align: "center",
          },
          {
            title: "Факультет",
            dataIndex: "faculty",
            key: "faculty",
            sorter: true,
            align: "center",
            ...getColumnSearchProps("faculty"),
          },
          {
            title: "Курс",
            dataIndex: "course",
            key: "course",
            sorter: true,
            align: "center",
            ...getColumnSearchProps("course"),
          },
          {
            title: "Группа",
            dataIndex: "name",
            key: "name",
            sorter: true,
            align: "center",
            ...getColumnSearchProps("name"),
          },
          {
            title: "Год создания",
            dataIndex: "year",
            key: "year",
            sorter: true,
            align: "center",
            ...getColumnSearchProps("name"),
          },
        ],
      },
    ],
    [getColumnSearchProps],
  );

  return (
    <div>
      <Flex gap='small' vertical align='center'>
        <Table
          style={{ width: "100%" }}
          size={"small"}
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
        <Pagination current={currentPage} onChange={(page) => setCurrentPage(page)} total={data?.count} pageSize={data?.size} />
      </Flex>
    </div>
  );
};

export default GroupList;
