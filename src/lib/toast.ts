import { toast, type ExternalToast } from 'svelte-sonner';
import Message from '$lib/components/toast/Message.svelte';
import type { ComponentType } from 'svelte';

type Msg = string | string[];
type ToastId = string | number;

type ToastFunc = (message: string | ComponentType, data?: ExternalToast) => string | number;

function send(func: ToastFunc, msg: Msg) {
  if (Array.isArray(msg)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: type error due to legacy code in svelte-sonner
    return func(Message, { componentProps: { message: msg } });
  }
  return func(msg);
}

function info(msg: Msg): ToastId {
  return send(toast.info, msg);
}

function error(msg: Msg): ToastId {
  return send(toast.error, msg);
}

function success(msg: Msg): ToastId {
  return send(toast.success, msg);
}

function warning(msg: Msg): ToastId {
  return send(toast.warning, msg);
}

function message(msg: Msg): ToastId {
  return send(toast.message, msg);
}

function loading(msg: Msg): ToastId {
  return send(toast.loading, msg);
}

export default {
  info,
  error,
  warning,
  success,
  message,
  loading
};
