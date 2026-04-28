import React, { useEffect } from "react";
import { Modal } from "antd";
import { Alert02Icon } from "hugeicons-react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginRequireModal = ({ open, close, actionName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (open) {
      document.body.style.overflowY = "auto";
      document.body.style.width = "100%";
    }
  }, [open]);

  const handleLoginRedirect = () => {
    navigate("/auth/login", {
      state: { returnTo: location.pathname + location.search },
      replace: true,
    });
  };
  return (
    <Modal
      forceRender
      destroyOnClose
      footer={null}
      centered
      open={open}
      onCancel={close}
    >
      <div
        style={{
          gap: "1rem",
        }}
        className="p-2 px-0 d-flex flex-column align-items-center justify-content-center "
      >
        <div className="d-flex align-items-center flex-column gap-2">
          <Alert02Icon
            size={48}
            strokeWidth={1}
            className="text-dark opacity-50"
          />
          <div className="d-flex align-items-center flex-column">
            <p className="fw-bold fs-4 text-center">تسجيل الدخول مطلوب</p>
            <p className="fw-light text-variant-1 fs-6 text-center">
              {actionName}
            </p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={handleLoginRedirect}
            style={{ borderRadius: "0.6rem" }}
            className="tf-btn primary text-dark"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginRequireModal;
