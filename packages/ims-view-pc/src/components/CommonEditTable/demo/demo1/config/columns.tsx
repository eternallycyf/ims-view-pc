import { ICommonEditTableColumnsType } from 'ims-view-pc';
import _ from 'lodash';
// import './index.less';
import { IColumnsExtraRecord, IFormValues, IRecord } from '..';

interface IGetColumnsParams {
  handleGetCurrentRatio: () => void;
  handleCheckIsRatioExceedExcessie: (_: any, val: number) => Promise<string>;
}
export const getColumns = (
  params: IGetColumnsParams,
): ICommonEditTableColumnsType<IRecord, IColumnsExtraRecord, IFormValues>[] => {
  const { handleGetCurrentRatio, handleCheckIsRatioExceedExcessie } = params;
  return [
    {
      dataIndex: 'userName',
      title: '姓名',
      type: 'update',
      align: 'center',
      ellipsis: true,
      width: 100,
      tooltip: 'sss',
      formItemProps: {
        itemProps: {
          noStyle: true,
          style: { display: 'flex' },
          shouldUpdate: (pre, cru) => true,
          next: (values, form, index) => {
            const record = values?.EditTable?.[index];
            if (record?.ratio === 10) return '---';
            return [
              {
                name: [index, 'userName'],
                type: 'input',
              },
            ];
          },
        },
      },
    },
    {
      dataIndex: 'time',
      title: '时间',
      type: 'date',
      align: 'center',
      formatTime: true,
      width: 100,
      formItemProps: {
        controlProps: {
          onChange: (e) => {
            console.log(e);
          },
        },
      },
    },
    {
      dataIndex: 'ratio',
      title: '比例',
      hasRequiredMark: true,
      type: 'inputNumber',
      align: 'left',
      formatNumber: true,
      width: 140,
      formatPercent: true,
      formItemProps: {
        controlProps: {
          min: 0,
          max: 100,
          step: 1,
          precision: 2,
          addonAfter: '%',
          style: { width: '100%' },
          onChange: handleGetCurrentRatio,
        },
        itemProps: {
          validateTrigger: ['onBlur', 'onSubmit'],
        },
        rules: [
          {
            required: true,
            validator: handleCheckIsRatioExceedExcessie,
            validateTrigger: 'onSubmit',
          },
        ],
      },
    },
  ];
};
