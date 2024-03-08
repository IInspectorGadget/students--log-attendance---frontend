import { SearchOutlined } from "@ant-design/icons";
import { Button, Space, DatePicker } from "antd";
const { RangePicker } = DatePicker;

const useDateSearch = (setCurrentFilters, setCurrentPage) => {
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

export default useDateSearch;
