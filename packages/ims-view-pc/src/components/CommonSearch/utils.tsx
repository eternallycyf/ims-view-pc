import { AnyObject, Ellipsis, type CommonSearchProps } from 'ims-view-pc';
import './index.less';
export const formatByAcpCode = (
  defaultFormList: CommonSearchProps<AnyObject, AnyObject, unknown>['formList'],
  accessCollection: string[],
): CommonSearchProps<AnyObject, AnyObject, unknown>['formList'] => {
  const formList = defaultFormList
    .filter(({ acpCode }) => (acpCode ? accessCollection.includes(acpCode) : true))
    .filter((item) => item?.visible ?? true)
    .map((item) => {
      if (typeof item?.label === 'string') {
        return {
          ...item,
          label: (
            <Ellipsis className="CommonSearch-Ellipsis" lines={1}>
              {item?.label}
            </Ellipsis>
          ),
        };
      }
      return item;
    })
    ?.map((item) => {
      if (item?.children) {
        return {
          ...item,
          children: item.children && formatByAcpCode(item.children || [], accessCollection),
        };
      } else {
        return item;
      }
    });
  return formList;
};
