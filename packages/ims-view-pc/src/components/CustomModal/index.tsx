import { Button, ButtonProps, Modal, ModalFuncProps } from 'antd';
import React from 'react';
import { variables } from '../../styles/variables';
import FormModal from './form';
import './index.less';

interface IAsyncConfirm {
  footerBtns?: ICreateModal['footerBtns'];
  modalProps?: ModalFuncProps;
  type?: ModalFuncProps['type'];
}

export const asyncConfirm = (
  props: IAsyncConfirm,
): Promise<{ destory: Function; update: Function }> => {
  const { footerBtns, modalProps, type = 'info' } = props;

  return new Promise((resolve) => {
    const { content } = modalProps;
    const originContent = modalProps?.footer ? (
      modalProps?.footer
    ) : (
      <div className="confirm_btns" style={{ '--primary-color': variables.colorPrimary }}>
        {footerBtns.map((b) => (
          <Button
            {...b.btnProps}
            key={b.code as any as React.Key}
            onClick={() => {
              if (b.code === false) {
                b.onClick ? b.onClick(b.code, modalRef.destroy) : modalRef.destroy();
              } else {
                b.onClick ? b.onClick(b.code, modalRef.destroy) : modalRef.destroy();
              }
            }}
          >
            {b.btnChild}
          </Button>
        ))}
      </div>
    );

    const modalContent = <>{content}</>;

    const footer =
      modalProps?.footer == undefined && footerBtns?.length == 0
        ? {}
        : {
            footer: originContent,
          };

    const modalRef = Modal[type]({
      ...modalProps,
      ...footer,
      className: 'async_confirm',
      content: modalContent as any,
    });
    resolve(modalRef as any as Promise<{ destory: Function; update: Function }>);
  });
};

interface ICreateModal {
  onOk?: (status: boolean, destoryFn: () => void) => void;
  type?: ModalFuncProps['type'];
  title?: React.ReactNode;
  content?: React.ReactNode;
  modalProps?: ModalFuncProps;
  footerBtns?: {
    code: boolean;
    btnChild: React.ReactNode;
    btnProps?: ButtonProps;
    onClick?: (status: boolean, destoryFn: () => void) => void;
  }[];
}

const DefaultModal = async ({
  onOk = (status, destoryFn) => {
    destoryFn();
  },
  type = 'info',
  title = '确定删除嘛',
  content = '',
  modalProps = {},
  footerBtns = [
    { code: false, btnChild: '取消' },
    {
      btnProps: { type: 'primary' },
      code: true,
      btnChild: '确定',
      onClick: onOk,
    },
  ],
}: ICreateModal) => {
  return await asyncConfirm({
    footerBtns,
    type,
    modalProps: {
      title,
      content,
      ...modalProps,
    },
  });
};

type CompoundedComponent = typeof DefaultModal & {
  FormModal: typeof FormModal;
};

const CustomModal = DefaultModal as CompoundedComponent;

CustomModal.FormModal = FormModal;

export default CustomModal;
