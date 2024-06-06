import { SearchOutlined } from "@ant-design/icons";
import { Button, Space, DatePicker } from "antd";
import { useCallback } from "react";
const { RangePicker } = DatePicker;

const useDateSearch = (setCurrentFilters, setCurrentPage) => {
  const handleSearch = useCallback(
    (close) => {
      close();
      setCurrentPage(1);
    },
    [setCurrentPage],
  );
  const getColumnSearchProps = useCallback(
    () => ({
      filterDropdown: ({ close }) => (
        <div
          style={{
            padding: 8,
            display: "flex",
            flexDirection: "column",
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <RangePicker
            placeholder={`Найти`}
            onChange={(dates, datesString) =>
              setCurrentFilters((prev) => ({
                ...prev,
                date: {
                  start: datesString[0],
                  end: datesString[1],
                },
              }))
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

useDateSearch.displayName = "useDateSearch";

export default useDateSearch;
