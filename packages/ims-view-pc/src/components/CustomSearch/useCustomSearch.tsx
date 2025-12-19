/* eslint-disable react-hooks/exhaustive-deps */
import { Form } from 'antd';
import type { ValueOf } from 'ims-view-pc';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { UseCustomSearchProps } from './interface';

const useCustomSearch = <T,>(props: UseCustomSearchProps<T>) => {
  const {
    initValues: _initValues = {} as Record<keyof T, ValueOf<T>>,
    setTableHeight,
    defaultWrapperHeight = 170,
    className,
    TableHeightDept = [],
  } = props;

  const [searchForm] = Form.useForm<T>();

  const [windowHeight, setWindowHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight;
    }
    return 0;
  });

  const [stableSearchHeight, setStableSearchHeight] = useState(0);
  const searchElementRef = useRef<Element | null>(null);
  const lastWindowWidthRef = useRef(window.innerWidth);

  const measureSearchHeight = () => {
    const element = document.querySelector(`.${className}`);
    if (element) {
      searchElementRef.current = element;
      const height = element.getBoundingClientRect().height;
      if (height > 0) {
        setStableSearchHeight(height);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      measureSearchHeight();
    }, 100);
    return () => clearTimeout(timer);
  }, [className]);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const widthChanged = Math.abs(currentWidth - lastWindowWidthRef.current) > 10;

      setWindowHeight(window.innerHeight);

      if (widthChanged) {
        lastWindowWidthRef.current = currentWidth;
        setTimeout(() => {
          measureSearchHeight();
        }, 150);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [className]);

  const TableHeight = useMemo(() => {
    const bodyHeight = windowHeight;
    if (bodyHeight === 0) return 'auto';
    const resultHeight = bodyHeight - 5 - defaultWrapperHeight - stableSearchHeight;
    if (setTableHeight) {
      return setTableHeight(resultHeight, stableSearchHeight, bodyHeight - defaultWrapperHeight);
    }
    return resultHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowHeight, stableSearchHeight, setTableHeight, defaultWrapperHeight, ...TableHeightDept]);

  /* eslint-disable react-hooks/exhaustive-deps */
  const initValues = useMemo(() => {
    const arr: { name: [keyof T]; value: ValueOf<T> }[] = [];
    Object.keys(_initValues).forEach((key) => {
      const typedKey = key as keyof T;
      const value = _initValues[typedKey];
      if (value !== undefined) {
        arr.push({ name: [typedKey], value });
      }
    });
    return arr;
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const [searchFormFields, setSearchFormFields] =
    useState<{ name: [keyof T]; value: ValueOf<T> }[]>(initValues);

  const formValues = useMemo(() => {
    const obj = {} as T;
    searchFormFields.forEach((item) => {
      const key = item.name[0];
      obj[key] = item.value as T[keyof T];
    });
    return obj;
  }, [searchFormFields]);

  const clearFormValues = () => {
    setSearchFormFields([]);
    searchForm.resetFields();
  };

  const resetFormValues = () => {
    setSearchFormFields(initValues);
    searchForm.setFieldsValue(_initValues as any);
  };

  const setFormValues = (values: Partial<T>) => {
    searchForm.setFieldsValue(values as any);
    setSearchFormFields((prevFields) => {
      const fieldMap = new Map<keyof T, ValueOf<T>>();
      prevFields.forEach((field) => {
        fieldMap.set(field.name[0], field.value);
      });

      Object.keys(values).forEach((key) => {
        const typedKey = key as keyof T;
        const value = values[typedKey];
        fieldMap.set(typedKey, value as ValueOf<T>);
      });

      return Array.from(fieldMap.entries()).map(([key, value]) => ({
        name: [key] as [keyof T],
        value,
      }));
    });
  };

  return {
    searchForm,
    initValues,
    formValues,
    setFormValues,
    clearFormValues,
    resetFormValues,
    TableHeight,
    SearchSize: searchElementRef.current
      ? {
          width: searchElementRef.current.getBoundingClientRect().width,
          height: stableSearchHeight,
        }
      : undefined,
    CustomSearchParams: {
      form: searchForm,
      formValues: searchFormFields,
      setSearchFormFields,
      formProps: {
        className: `${className}`,
        style: {
          gap: 8,
        },
      },
    },
  };
};

export default useCustomSearch;
