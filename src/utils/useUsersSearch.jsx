import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import { useRef } from "react";

const useUsersSearch = (searchData, setSearchData, setCurrentPage) => {
  const searchFirstName = useRef(null);
  const searchLastName = useRef(null);
  const searchMiddleName = useRef(null);
  const handleSearch = (selectedKeys, close = null) => {
    if (close) close();
    setSearchData({
      last_name: selectedKeys[0],
      first_name: selectedKeys[1],
      middle_name: selectedKeys[2],
    });
    setCurrentPage(1);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const getColumnSearchProps = () => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchLastName}
          placeholder={`Фамилия`}
          value={selectedKeys[0]}
          onChange={(e) => {
            const newKeys = selectedKeys.slice();
            newKeys[0] = e.target.value;
            setSelectedKeys(newKeys);
          }}
          onPressEnter={() => handleSearch(selectedKeys, close)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Input
          ref={searchFirstName}
          placeholder={`Имя`}
          value={selectedKeys[1]}
          onChange={(e) => {
            const newKeys = selectedKeys.slice();
            newKeys[1] = e.target.value;
            setSelectedKeys(newKeys);
          }}
          onPressEnter={() => handleSearch(selectedKeys, close)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Input
          ref={searchMiddleName}
          placeholder={`Отчество`}
          value={selectedKeys[2]}
          onChange={(e) => {
            const newKeys = selectedKeys.slice();
            newKeys[2] = e.target.value;
            setSelectedKeys(newKeys);
          }}
          onPressEnter={() => handleSearch(selectedKeys, close)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button type='primary' onClick={() => handleSearch(selectedKeys, close)} icon={<SearchOutlined />} size='small'>
            Поиск
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size='small'>
            Сбросить
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              handleSearch(selectedKeys);
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
    render: (text) => {
      const textArr = text.split(/\s+/);
      const last_name = textArr[0] + " ";
      const first_name = textArr[1] + " ";
      const middle_name = textArr[2];
      return searchData?.first_name || searchData?.last_name || searchData?.middle_name ? (
        <>
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchData["last_name"]]}
            autoEscape
            textToHighlight={last_name}
          />
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchData["first_name"]]}
            autoEscape
            textToHighlight={first_name}
          />
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchData["middle_name"]]}
            autoEscape
            textToHighlight={middle_name}
          />
        </>
      ) : (
        text
      );
    },
  });
  return getColumnSearchProps;
};

export default useUsersSearch;
