import { toast } from "react-toastify";

const toastNotify = (message, type, position = "bottom-left") =>
  toast(message, {
    type,
    position,
    className: "rounded-2  p-3",
  });

export default toastNotify;
