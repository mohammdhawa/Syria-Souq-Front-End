import toastNotify from "@/utils/toast";
import { Alert } from "antd";
import { Call02Icon, Mail01Icon, WhatsappIcon } from "hugeicons-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function ContactSeller({ seller, ad }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isOwner = isAuthenticated && user?.id === ad?.user?.id;

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    return (firstName[0] + lastName[0]).toUpperCase();
  };

  const handleWhatsAppClick = () => {
    if (seller?.phone_number) {
      const phone = seller.phone_number.replace(/\D/g, "");
      const message = `مرحباً, هل لا زال هذا الإعلان متاح؟\n${ad?.title}`;
      const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappURL, "_blank");
    }
  };

  const handleEmailClick = () => {
    if (seller?.email) {
      const subject = `استفسار عن الإعلان`;
      const body = `مرحبًا، أود معرفة المزيد حول إعلانك بعنوان ${ad?.title}`;
      const mailtoURL = `mailto:${seller.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoURL;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toastNotify("تم النسخ بنجاح", "success");
    });
  };

  return (
    <>
      <h5 className="title fw-6 mb-4">معلومات المعلن</h5>

      <div className="box-avatar">
        {seller?.image ? (
          <div className="avatar avt-100 round">
            <img
              alt={seller?.name}
              src={seller?.image}
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="avatar avt-100 fs-2 fw-bold round bg-light d-flex align-items-center justify-content-center rounded-circle">
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
                transform: "scale(1.3)",
              }}
              src="/images/no_profile.png"
              alt="No profile image"
            />
          </div>
        )}

        <div className="info">
          <h6 className="name mb-2 fs-5">{seller?.name}</h6>
          <ul className="list">
            <li className="d-flex align-items-center mb-1 gap-4 fs-16 fw-light">
              <Call02Icon size={16} />
              <span
                dir="ltr"
                className="contact-link"
                onClick={() => copyToClipboard(seller?.phone_number)}
                title="اضغط للنسخ"
              >
                {seller?.phone_number}
              </span>
            </li>
            <li className="d-flex align-items-center gap-4 fs-16 fw-light">
              <Mail01Icon size={16} />
              <span
                dir="ltr"
                className="contact-link"
                onClick={() => copyToClipboard(seller?.email)}
                title="اضغط للنسخ"
              >
                {seller?.email}
              </span>
            </li>
          </ul>
        </div>
      </div>
      {!isOwner ? (
        <form
          className="contact-form d-flex flex-column gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <button
            type="button"
            className="tf-btn whatsapp-button btn-view text-black hover-btn-view w-100"
            onClick={handleWhatsAppClick}
          >
            <WhatsappIcon size={20} />
            تواصل عبر واتساب
          </button>
          <button
            type="button"
            className="tf-btn btn-view text-black w-100"
            onClick={handleEmailClick}
          >
            تواصل عبر البريد الالكتروني
          </button>
        </form>
      ) : (
        <Alert
          message={
            <div className="d-flex align-items-center justify-content-between">
              <p>معلومات التواصل الخاصة بك تظهر بهذا الشكل</p>
              <Link to={"/dashboard/profile"} style={{ color: "#1b82e3" }}>
                تعديل
              </Link>
            </div>
          }
          className="w-100 mt-3"
        />
      )}
    </>
  );
}
