import type { ValueOf } from 'ims-view-pc';
import lodash from 'lodash';
import CustomForm, { ModalTypeEnum, type ModalType } from '../CustomForm';
import type { CustomSearchProps } from './interface';

const CustomSearch = <T, R>(props: CustomSearchProps<T, R, ModalType>) => {
  const {
    formList = [],
    formProps,
    formValues,
    setSearchFormFields,
    children,
    enabledColumnsSearch = false,
  } = props;

  return (
    <>
      <CustomForm<T, R, typeof CustomForm.CONSTANT.MODAL_TYPE.normal>
        modalType={CustomForm.CONSTANT.MODAL_TYPE.normal}
        footer={null}
        {...props}
        rowProps={{
          wrap: true,
          gutter: [8, 8],
          style: {
            width: '100%',
          },
          ...props?.rowProps,
          className: `pl-1 ${enabledColumnsSearch && formProps?.className} ${
            props?.rowProps?.className
          }`,
        }}
        formList={formList}
        formProps={{
          layout: enabledColumnsSearch ? 'horizontal' : 'inline',
          autoComplete: 'off',
          fields: formValues,
          onFieldsChange: setSearchFormFields
            ? lodash.debounce((_, allFields) => {
                setSearchFormFields(allFields as { name: [keyof T]; value: ValueOf<T> }[]);
              }, 700)
            : undefined,
          ...formProps,
          className: enabledColumnsSearch ? undefined : formProps?.className,
        }}
      >
        {children}
      </CustomForm>
    </>
  );
};

export default CustomSearch;
