import OvalLoader from "@/components/OvalLoader";
import {
  deleteAdvertisement,
  fetchMyAdvertisements,
} from "@/redux/actions/myAdvertisementsActions";
import { Modal } from "antd";
import { Alert02Icon } from "hugeicons-react";
import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DeleteAdModal = ({
  open,
  close,
  adId,
  redirectAfterDelete = "",
  onDeleteSuccess,
}) => {
  const { deletingLoading } = useSelector((state) => state.myAdvertisements);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    await dispatch(deleteAdvertisement(adId));
    if (redirectAfterDelete && redirectAfterDelete !== "") {
      navigate(redirectAfterDelete, { replace: true });
      return;
    }
    handleModalClose();
    onDeleteSuccess();
  };

  const handleModalClose = () => {
    close();
  };

  return (
    <Modal
      forceRender
      destroyOnClose
      footer={null}
      centered
      open={open}
      onCancel={handleModalClose}
    >
      <div
        style={{ gap: "1rem" }}
        className="p-2 px-0 d-flex flex-column align-items-center justify-content-center"
      >
        <div className="d-flex align-items-center flex-column gap-2">
          <Alert02Icon
            size={48}
            strokeWidth={1}
            className="text-dark opacity-50"
          />
          <div className="d-flex align-items-center flex-column">
            <p className="fw-bold fs-4 text-center">تحذير!</p>
            <p className="fw-light text-variant-1 fs-6 text-center">
              هل أنت متأكد من حذف هذا الإعلان؟
            </p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <span onClick={handleModalClose} className="cancel-password">
            تراجع
          </span>
          <button
            variant="solid"
            color="danger"
            style={{ borderRadius: "0.6rem" }}
            className="tf-btn delete-account-btn"
            onClick={handleDelete}
            disabled={deletingLoading}
          >
            {deletingLoading ? <OvalLoader primary="white" /> : "نعم, احذف"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAdModal;
