import { SearchOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Popover, Space, Typography } from "antd";
import Highlighter from "react-highlight-words";
import { useCallback, useState } from "react";

const useUsersSearch = (searchData, setSearchData, setCurrentPage) => {
  const [checked, setChecked] = useState(false);

  const handleSearch = useCallback(
    (selectedKeys, close = null) => {
      if (close) close();
      setSearchData({
        last_name: selectedKeys[0],
        first_name: selectedKeys[1],
        middle_name: selectedKeys[2],
        teacher_replacement: checked,
      });
      setCurrentPage(1);
    },
    [setCurrentPage, setSearchData, checked],
  );

  const handleReset = useCallback((clearFilters) => {
    clearFilters();
  }, []);

  const getColumnSearchProps = useCallback(
    () => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
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
          <div
            style={{
              marginBottom: 8,
              display: "",
            }}
          >
            <Checkbox
              onChange={(e) => {
                setChecked(e.target.checked);
              }}
            >
              Включая замены?
            </Checkbox>
          </div>
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
        console.log(text);
        const textArr = text?.props?.children?.props?.children ? text?.props?.children?.props?.children?.split(/\s+/) : text.split(/\s+/);
        const textPopoverArr = text?.props?.content ? text?.props?.content.split(/\s+/) : "";
        const popover_last_name = textPopoverArr[0] + " ";
        const popover_first_name = textPopoverArr[1] + " ";
        const popover_middle_name = textPopoverArr[2] + " ";

        const last_name = textArr[0] + " ";
        const first_name = textArr[1] + " ";
        const middle_name = textArr[2];

        const highlighterData = [
          {
            searchData: "last_name",
            textToHighlight: last_name,
            textToPopoverHighlight: popover_last_name,
          },
          {
            searchData: "first_name",
            textToHighlight: first_name,
            textToPopoverHighlight: popover_first_name,
          },
          {
            searchData: "middle_name",
            textToHighlight: middle_name,
            textToPopoverHighlight: popover_middle_name,
          },
        ];

        return searchData?.first_name || searchData?.last_name || searchData?.middle_name ? (
          <>
            <Popover
              content={
                textPopoverArr &&
                highlighterData.map((el, idx) => (
                  <Highlighter
                    key={idx}
                    highlightStyle={{
                      backgroundColor: "#ffc069",
                      padding: 0,
                    }}
                    searchWords={[searchData[el.searchData]]}
                    autoEscape
                    textToHighlight={el.textToPopoverHighlight}
                  />
                ))
              }
            >
              {textPopoverArr ? (
                <Typography.Text type='warning'>
                  {highlighterData.map((el, idx) => (
                    <Highlighter
                      key={idx}
                      highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                      }}
                      searchWords={[searchData[el.searchData]]}
                      autoEscape
                      textToHighlight={textPopoverArr ? el.textToHighlight : el.textToHighlight}
                    />
                  ))}
                </Typography.Text>
              ) : (
                highlighterData.map((el, idx) => (
                  <Highlighter
                    key={idx}
                    highlightStyle={{
                      backgroundColor: "#ffc069",
                      padding: 0,
                    }}
                    searchWords={[searchData[el.searchData]]}
                    autoEscape
                    textToHighlight={textPopoverArr ? el.textToHighlight : el.textToHighlight}
                  />
                ))
              )}
            </Popover>
          </>
        ) : (
          text
        );
      },
    }),
    [handleReset, handleSearch, searchData],
  );
  return getColumnSearchProps;
};

export default useUsersSearch;
