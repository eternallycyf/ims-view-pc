import type { ValueOf } from 'ims-view-pc';
import { CustomFormProps, ModalType } from '../CustomForm';

export type CustomSearchProps<
  T = Record<string, unknown>,
  R = Record<string, unknown>,
  Type extends ModalType = 'normal',
> = CustomFormProps<T, R, Type> & {
  formValues: {
    name: [keyof T];
    value: ValueOf<T>;
  }[];
  setSearchFormFields: (allFields: { name: [keyof T]; value: ValueOf<T> }[]) => void;
};

export interface UseCustomSearchProps<T> {
  initValues?: Partial<Record<keyof T, ValueOf<T>>>;
  className?: string;
  setTableHeight?: (totalHeight: number, searchHeight: number, defaultHeight: number) => number;
  defaultWrapperHeight?: number;
  TableHeightDept?: any[];
}
