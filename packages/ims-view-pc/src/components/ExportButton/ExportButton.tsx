import { SyncOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useCallback } from 'react';
import type { IExportButtonProps } from './interface';
import * as TableHepler from './utils';

const ExportButton = <DataType, Params>(props: IExportButtonProps<DataType, Params>) => {
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
    setSheetStyle = () => {
      return {
        views: [
          {
            state: 'frozen',
            xSplit: 0,
            ySplit: 1,
          },
        ],
      };
    },
    setInsertFooter,
    setInsertHeader,
    setWorkSheet,
    isMultiple = false,
    multipleConfig = [],
    buttonProps = {},
  } = props;

  const { children: buttonLabel, ...restButtonProps } = buttonProps;

  const [loading, setLoading] = React.useState<boolean>(false);

  const handleExport = useCallback(
    async (data: DataType[]) => {
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
          handleProgressOnChange(percent);
        },
      };
      if (renderCell) {
        exportConfig = {
          ...exportConfig,
          spanMethod: renderCell,
        };
      }
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
        exportConfig = multipleConfig.map((item) => ({
          ...item,
          column: item.column ?? item.columns,
        }));
      }

      const instance = new TableHepler.ElMapExportTable(exportConfig, otherExportConfig);
      await instance.download(fileName || 'excel');
    },
    [
      request,
      dataSource,
      columns,
      sheetName,
      fileName,
      setImageStyle,
      setColumnStyle,
      setRowStyle,
      setCellStyle,
      setCellFormat,
      setSheetStyle,
      setInsertFooter,
      setInsertHeader,
      setWorkSheet,
      renderCell,
      treeConfig,
      isMultiple,
      multipleConfig,
      handleProgressOnChange,
    ],
  );

  const fetchExportData = useCallback(
    async (requestParams: Params | undefined) => {
      if (!request || loading) return;
      setLoading(true);
      try {
        const { data = [] } = await request(requestParams as Params);
        await handleExport(data as DataType[]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [request, handleExport, loading],
  );

  return (
    <Button
      type="primary"
      {...restButtonProps}
      loading={loading || Boolean(restButtonProps.loading)}
      icon={loading ? <SyncOutlined spin /> : restButtonProps.icon}
      onClick={() => {
        void fetchExportData(params);
      }}
    >
      {buttonLabel ?? '导出'}
    </Button>
  );
};

export default ExportButton;
