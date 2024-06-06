import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import { useCallback, useRef } from "react";

const useSearch = (currentFilters, setCurrentFilters, setCurrentPage) => {
  const searchInput = useRef(null);

  const handleSearch = useCallback(
    (selectedKeys, name, close = null) => {
      if (close) close();
      setCurrentFilters((prev) => ({
        ...prev,
        [name]: selectedKeys[0],
      }));
      setCurrentPage(1);
    },
    [setCurrentPage, setCurrentFilters],
  );

  const handleReset = useCallback((clearFilters) => {
    clearFilters();
  }, []);

  const getColumnSearchProps = useCallback(
    (name) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, clearFilters, close }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Найти`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, name, close)}
            style={{
              marginBottom: 8,
              display: "block",
            }}
          />
          <Space>
            <Button type='primary' onClick={() => handleSearch(selectedKeys, name, close)} icon={<SearchOutlined />} size='small'>
              Поиск
            </Button>
            <Button onClick={() => clearFilters && handleReset(clearFilters)} size='small'>
              Сбросить
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
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) => {
        if (Array.isArray(text)) {
          return currentFilters[name]
            ? text.map((el, idx) => (
                <p key={idx}>
                  <Highlighter
                    highlightStyle={{
                      backgroundColor: "#ffc069",
                      padding: 0,
                    }}
                    searchWords={[currentFilters[name]]}
                    autoEscape
                    textToHighlight={el.props.children}
                  />
                </p>
              ))
            : text;
        }

        return currentFilters[name] ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[currentFilters[name]]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        );
      },
    }),
    [currentFilters, handleReset, handleSearch],
  );
  return getColumnSearchProps;
};

export default useSearch;
