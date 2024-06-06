import { Breadcrumb, Flex, Pagination, Table, Typography } from "antd";
import { useCallback, useState } from "react";
import useAxios from "@src/utils/useAxios";
import useSearch from "@src/utils/useSearch";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";

const Groups = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState({});
  const [currentFilters, setCurrentFilters] = useState({});
  const { id, subject } = useParams();
  const api = useAxios();

  const getColumnSearchProps = useSearch(currentFilters, setCurrentFilters, setCurrentPage);

  const getGroups = useCallback(async () => {
    try {
      if (id) {
        const response = await api.get(`/api/groups/${id}/?page=${currentPage}`, {
          params: {
            sort_field: currentSort?.field,
            sort_order: currentSort?.order,
            ...currentFilters,
          },
        });
        return response.data;
      } else {
        const response = await api.get(`/api/groups/?page=${currentPage}`, {
          params: {
            sort_field: currentSort?.field,
            sort_order: currentSort?.order,
            ...currentFilters,
          },
        });
        return response.data;
      }
    } catch (err) {
      console.error(err);
    }
  }, [id, api, currentPage, currentSort, currentFilters]);

  const { data, isLoading } = useQuery(["groups", id, api, currentPage, currentSort, currentFilters], getGroups, {
    keepPreviousData: true,
  });

  const getDataSource = useCallback(
    () =>
      data?.results?.map((el) => {
        return {
          key: el.id,
          id: id ? (
            <Link to={`/journal/${subject}/${id}/${el.name}/${el.id}`}>открыть</Link>
          ) : (
            <Link to={`/paperJournal/${el.name}/${el.id}`}>открыть</Link>
          ),
          name: el.name,
          course: el.course,
          faculty: el.faculty,
        };
      }),
    [id, subject, data],
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
            title: "Журнал",
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
        ],
      },
    ],
    [getColumnSearchProps],
  );

  return (
    <div>
      <Breadcrumb
        items={
          id
            ? [
                {
                  title: <Link to='/journal'>Журнал</Link>,
                },
                {
                  title: subject,
                },
              ]
            : [{ title: "Журнал" }]
        }
      />
      <Flex gap='small' vertical align='center'>
        <Table
          style={{ width: "100%" }}
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
        <Pagination current={currentPage} onChange={(page) => setCurrentPage(page)} total={data?.count} pageSize={data?.size} />
      </Flex>
    </div>
  );
};

export default Groups;
