import { Breadcrumb, Flex, Pagination, Table, Typography } from "antd";
import { useCallback, useContext, useState } from "react";
import useAxios from "@src/utils/useAxios";
import useSearch from "@src/utils/useSearch";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import AuthContext from "@src/context/AuthContext";

const Subjects = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState({});
  const [currentFilters, setCurrentFilters] = useState({});
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const getColumnSearchProps = useSearch(currentFilters, setCurrentFilters, setCurrentPage);
  console.log(user);
  const getSubjects = useCallback(async () => {
    try {
      const response = await api.get(`/api/subjects/?page=${currentPage}`, {
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
  }, [api, currentSort, currentPage, currentFilters]);

  const { data, isLoading } = useQuery(["subjects", currentPage, currentSort, currentFilters], getSubjects, {
    keepPreviousData: true,
  });

  const getDataSource = useCallback(() => {
    if (!data) return;
    return data.results.map((el, idx) => {
      const link =
        user.type === "student" ? `/journal/${el.name}/${el.id}/${user.group.name}/${user.group.id}` : `/journal/${el.name}/${el.id}`;
      return {
        key: idx,
        id: <Link to={link}>открыть</Link>,
        subject: el.name,
      };
    });
  }, [data, user]);

  const getColumns = useCallback(
    () => [
      {
        title: (
          <Typography.Title style={{ margin: 0 }} level={2}>
            Список Дисциплин
          </Typography.Title>
        ),
        children: [
          {
            title: "Выбрать",
            dataIndex: "id",
            key: "id",
            align: "center",
          },
          {
            title: "Дисциплина",
            dataIndex: "subject",
            key: "subject",
            sorter: true,
            align: "center",
            ...getColumnSearchProps("subject"),
          },
        ],
      },
    ],
    [getColumnSearchProps],
  );

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: "Журнал",
          },
        ]}
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

export default Subjects;
