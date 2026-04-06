import React, { useState } from "react";
import { TableProps } from "../../types/management";
import LoadingSpinner from "../LoadingSpinner";

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  rowSelection,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSelectAll = (checked: boolean) => {
    if (!rowSelection) return;

    if (checked) {
      const allKeys = data.map((item, index) => item.id || index);
      rowSelection.onChange(allKeys, data);
    } else {
      rowSelection.onChange([], []);
    }
  };

  const handleSelectRow = (record: T, checked: boolean) => {
    if (!rowSelection) return;

    const key = record.id || data.indexOf(record);
    let newSelectedKeys = [...rowSelection.selectedRowKeys];
    let newSelectedRows = data.filter((item) =>
      newSelectedKeys.includes(item.id || data.indexOf(item)),
    );

    if (checked) {
      newSelectedKeys.push(key);
      newSelectedRows.push(record);
    } else {
      newSelectedKeys = newSelectedKeys.filter((k) => k !== key);
      newSelectedRows = newSelectedRows.filter((item) => item !== record);
    }

    rowSelection.onChange(newSelectedKeys, newSelectedRows);
  };

  if (loading) {
    return (
      <div className="data-table-loading">
        <LoadingSpinner text="Loading data..." />
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {rowSelection && (
                <th className="select-column">
                  <input
                    type="checkbox"
                    checked={
                      rowSelection.selectedRowKeys.length === data.length &&
                      data.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={column.sortable ? "sortable" : ""}
                  onClick={() =>
                    column.sortable && handleSort(String(column.key))
                  }
                >
                  <div className="th-content">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <span className="sort-indicator">
                        {sortConfig?.key === column.key
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (rowSelection ? 1 : 0)}
                  className="empty-row"
                >
                  <div className="empty-state">
                    <div className="empty-icon">📄</div>
                    <p>No data available</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => {
                const key = record.id || index;
                const isSelected = rowSelection?.selectedRowKeys.includes(key);

                return (
                  <tr key={key} className={isSelected ? "selected" : ""}>
                    {rowSelection && (
                      <td className="select-column">
                        <input
                          type="checkbox"
                          checked={isSelected || false}
                          onChange={(e) =>
                            handleSelectRow(record, e.target.checked)
                          }
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={String(column.key)}>
                        {column.render
                          ? column.render(record[column.key as keyof T], record)
                          : String(record[column.key as keyof T] || "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing{" "}
            {Math.min(
              (pagination.current - 1) * pagination.pageSize + 1,
              pagination.total,
            )}{" "}
            to{" "}
            {Math.min(
              pagination.current * pagination.pageSize,
              pagination.total,
            )}{" "}
            of {pagination.total} entries
          </div>
          <div className="pagination-controls">
            <button
              className="btn btn-outline btn-sm"
              disabled={pagination.current === 1}
              onClick={() =>
                pagination.onChange(pagination.current - 1, pagination.pageSize)
              }
            >
              Previous
            </button>
            <span className="page-info">
              Page {pagination.current} of{" "}
              {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              className="btn btn-outline btn-sm"
              disabled={
                pagination.current >=
                Math.ceil(pagination.total / pagination.pageSize)
              }
              onClick={() =>
                pagination.onChange(pagination.current + 1, pagination.pageSize)
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
