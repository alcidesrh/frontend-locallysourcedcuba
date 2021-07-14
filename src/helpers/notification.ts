import { Notify, Dialog } from 'quasar';

export const error = (error: Error) => {
  Notify.create({
    position: 'top',
    color: 'negative',
    textColor: 'white',
    icon: 'warning',
    message: error.stack,
  });
};

export const success = (values: {
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'center';
  color?: string;
  textColor?: string;
  icon?: string;
  message: string;
}) => {
  const { color, textColor, icon, message, position } = values;

  Notify.create({
    position: position || 'top',
    color: color || 'positive',
    textColor: textColor || 'white',
    icon: icon || 'done',
    message: message,
  });
};

export const beforeRemove = (
  params = {
    title: 'Confirm',
    message: 'Would you like to delete this item?',
    cancel: true,
    persistent: true,
  }
) => {
  return Dialog.create(params);
};
