import { SearchOutlined } from "@ant-design/icons";
import { Button, Select, Flex } from "antd";
import { useCallback } from "react";

const useSelectSearch = (setCurrentFilters, setCurrentPage) => {
  const handleSearch = useCallback(
    (selectedKeys, close) => {
      close();
      setCurrentFilters((prev) => ({
        ...prev,
        isComplete: selectedKeys[0],
      }));
      setCurrentPage(1);
    },
    [setCurrentPage, setCurrentFilters],
  );
  const getColumnSearchProps = useCallback(
    () => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, close }) => (
        <Flex
          vertical
          gap={8}
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Select
            style={{ width: 120 }}
            placeholder='-'
            onChange={(value) => {
              setSelectedKeys(value ? [value] : []);
            }}
          >
            <Select.Option value='-'>-</Select.Option>
            <Select.Option value='true'>Да</Select.Option>
            <Select.Option value='false'>Нет</Select.Option>
          </Select>
          <Button type='primary' onClick={() => handleSearch(selectedKeys, close)} icon={<SearchOutlined />} size='small'>
            Поиск
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close();
            }}
          >
            закрыть
          </Button>
        </Flex>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? "#1677ff" : undefined,
            width: "15px",
          }}
        />
      ),
    }),
    [handleSearch],
  );
  return getColumnSearchProps;
};

useSelectSearch.displayName = "useDateSearch";

export default useSelectSearch;
