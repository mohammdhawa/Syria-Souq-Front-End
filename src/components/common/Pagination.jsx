import React from "react";
import { Pagination as AntdPagination, ConfigProvider } from "antd";
import arEG from "antd/locale/ar_EG";
export default function Pagination({
  itemLength = 0,
  itemPerPage = 10,
  setPage,
  currentPage = 1,
  defaultCurrent,
  ...rest
}) {
  const total = itemLength;

  const handleChange = (page) => {
    if (setPage) {
      setPage(page);
    }
  };

  return (
    <ConfigProvider locale={arEG} direction="rtl">
      {total > 0 && (
        <AntdPagination
          style={{
            transform: "scale(1.2)",
            paddingBottom: "1rem",
          }}
          current={currentPage}
          defaultCurrent={defaultCurrent || 1}
          total={total}
          pageSize={itemPerPage}
          onChange={handleChange}
          showSizeChanger={false}
          {...rest}
          size="large"
        />
      )}
    </ConfigProvider>
  );
}
