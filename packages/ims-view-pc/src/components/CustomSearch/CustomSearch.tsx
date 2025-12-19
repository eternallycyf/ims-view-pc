import type { ValueOf } from 'ims-view-pc';
import lodash from 'lodash';
import CustomForm from '../CustomForm';
import type { CustomSearchProps } from './interface';

const CustomSearch = <T, R>(
  props: CustomSearchProps<T, R, typeof CustomForm.ModalTypeEnum.normal>,
) => {
  const { formList = [], formProps, formValues, setSearchFormFields } = props;

  return (
    <>
      <CustomForm<T, R, typeof CustomForm.ModalTypeEnum.normal>
        modalType={CustomForm.ModalTypeEnum.normal}
        rowProps={{
          wrap: true,
          gutter: [8, 8],
          style: {
            paddingLeft: 2,
          },
        }}
        footer={null}
        {...props}
        formList={formList}
        formProps={{
          layout: 'inline',
          autoComplete: 'off',
          fields: formValues,
          onFieldsChange: setSearchFormFields
            ? lodash.debounce((_, allFields) => {
                setSearchFormFields(allFields as { name: [keyof T]; value: ValueOf<T> }[]);
              }, 700)
            : undefined,
          ...formProps,
          className: formProps?.className,
        }}
      />
    </>
  );
};

export default CustomSearch;
