import { SearchOutlined } from "@ant-design/icons";
import { Button, Space, TimePicker } from "antd";
import { useCallback } from "react";

const useTimeSearch = (setCurrentFilters, setCurrentPage) => {
  const handleSearch = useCallback(
    (close) => {
      close();
      setCurrentPage(1);
    },
    [setCurrentPage],
  );
  const getColumnSearchProps = useCallback(
    (isEnd = false) => ({
      filterDropdown: ({ close }) => (
        <div
          style={{
            padding: 8,
            display: "flex",
            flexDirection: "column",
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <TimePicker.RangePicker
            format={"HH:mm"}
            placeholder='Выберите время'
            onChange={(values, valuesStr) =>
              setCurrentFilters((prev) => {
                if (isEnd) {
                  return { ...prev, time_end: { start: valuesStr[0], end: valuesStr[1] } };
                } else {
                  return { ...prev, time_start: { start: valuesStr[0], end: valuesStr[1] } };
                }
              })
            }
            style={{
              marginBottom: 8,
            }}
          />
          <Space>
            <Button type='primary' onClick={() => handleSearch(close)} icon={<SearchOutlined />} size='small'>
              Поиск
            </Button>
            <Button
              type='link'
              size='small'
              onClick={() => {
                handleSearch(close);
              }}
            >
              Применить
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
          </Space>
        </div>
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
    [handleSearch, setCurrentFilters],
  );
  return getColumnSearchProps;
};

export default useTimeSearch;
