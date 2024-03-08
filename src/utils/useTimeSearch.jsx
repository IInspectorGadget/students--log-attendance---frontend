import { SearchOutlined } from "@ant-design/icons";
import { Button, Space, TimePicker } from "antd";

const useTimeSearch = (setCurrentFilters, setCurrentPage) => {
  const handleSearch = (close) => {
    close();
    setCurrentPage(1);
  };
  const getColumnSearchProps = () => ({
    filterDropdown: ({ close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <TimePicker.RangePicker
          placeholder={`с:`}
          onChange={(values, valuesStr) =>
            setCurrentFilters((prev) => ({ ...prev, time_start: { start: valuesStr[0], end: valuesStr[1] } }))
          }
          onPressEnter={() => handleSearch(close)}
          style={{
            marginBottom: 8,
            display: "block",
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
    render: (text) => text,
  });
  return getColumnSearchProps;
};

export default useTimeSearch;
