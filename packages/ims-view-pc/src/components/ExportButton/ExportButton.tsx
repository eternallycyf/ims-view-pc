import { SyncOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { FC, useCallback } from 'react';
import { IExportButtonProps } from './interface';
import * as TableHepler from './utils';

const ExportButton: FC<IExportButtonProps> = (props) => {
  const {
    params,
    request,
    dataSource,
    columns,
    fileName,
    handleProgressOnChange = () => {},
    renderCell,
    treeConfig,
    setImageStyle,
    setColumnStyle,
    setRowStyle,
    setCellStyle,
    setCellFormat,
    sheetName,
    setSheetStyle,
    setInsertFooter,
    setInsertHeader,
    setWorkSheet,
    isMultiple = false,
    multipleConfig = [],
  } = props;

  const [loading, setLoading] = React.useState<boolean>(false);
  const fetchExportData = useCallback(
    async (params) => {
      setLoading(true);
      try {
        const { data, total, success } = await request(params);
        setTimeout(function () {
          handleExport(data);
        }, 0);
        return data;
      } catch (error) {
        setLoading(false);
        console.log(error);
        return [];
      }
    },
    [params, loading],
  );

  const handleExport = (data: any[]) => {
    const newData = !request ? dataSource : data;
    let exportConfig: any = {
      data: newData,
      column: columns,
      sheetName: sheetName || fileName || 'sheet1',
      setImageStyle,
      setColumnStyle,
      setRowStyle,
      setCellStyle,
      setCellFormat,
      setSheetStyle,
      setInsertFooter,
      setInsertHeader,
      setWorkSheet,
    };
    let otherExportConfig: any = {
      progress: (percent: number) => {
        console.log(percent);
        if (percent === 100) {
          setLoading(false);
        }
        handleProgressOnChange(percent);
      },
    };
    if (renderCell) exportConfig.spanMethod = renderCell;
    if (treeConfig?.treeNode) {
      exportConfig = {
        ...exportConfig,
        ...treeConfig,
      };

      otherExportConfig = {
        ...otherExportConfig,
        indentSize: treeConfig?.indentSize || 1,
      };
    }
    if (isMultiple) {
      exportConfig = [...multipleConfig];
    }

    const instance = new TableHepler.ElMapExportTable(exportConfig, otherExportConfig);
    instance.download(fileName || 'excel');
  };

  return (
    <Button
      icon={loading && <SyncOutlined spin />}
      onClick={() => fetchExportData(params)}
      type="default"
      size="small"
    >
      导出
    </Button>
  );
};

export default React.memo(ExportButton);
