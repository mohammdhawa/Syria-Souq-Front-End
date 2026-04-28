import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import emailjs from "@emailjs/browser";
import { footerSections } from "@/data/footer";
import { Call02Icon, Location01Icon, Mail01Icon } from "hugeicons-react";
export default function Footer() {
  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const sendMail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_noj8796", "template_fs3xchn", formRef.current, {
        publicKey: "iG4SCmR-YtJagQ4gV",
      })
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          handleShowMessage();

          formRef.current.reset();
        } else {
          setSuccess(false);
          handleShowMessage();
        }
      })
      .catch((err) => {});
  };
  useEffect(() => {
    const headings = document.querySelectorAll(".footer-heading-mobile");

    const toggleOpen = (event) => {
      const parent = event.target.closest(".footer-col-block");
      const content = parent.querySelector(".tf-collapse-content");

      if (parent.classList.contains("open")) {
        parent.classList.remove("open");
        content.style.height = "0px";
      } else {
        parent.classList.add("open");
        content.style.height = content.scrollHeight + "px";
      }
    };

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });

    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []);

  return (
    <footer style={{ direction: "ltr" }} className="footer">
      <div className="top-footer">
        <div className="container">
          <div className="content-footer-top">
            <div className="wd-social">
              <ul
                style={{ marginRight: "10px" }}
                className="list-social d-flex align-items-center"
              >
                <li>
                  <a href="https://www.facebook.com/profile.php?id=61578787598408" target="_blank" rel="noopener noreferrer" className="box-icon w-40 social">
                    <svg
                      className="icon"
                      width={9}
                      height={16}
                      viewBox="0 0 9 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.60547 9L8.00541 6.10437H5.50481V4.22531C5.50481 3.43313 5.85413 2.66094 6.97406 2.66094H8.11087V0.195625C8.11087 0.195625 7.07925 0 6.09291 0C4.03359 0 2.68753 1.38688 2.68753 3.8975V6.10437H0.398438V9H2.68753V16H5.50481V9H7.60547Z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/syriasouq_official/" target="_blank" rel="noopener noreferrer" className="box-icon w-40 social">
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.99812 4.66567C5.71277 4.66567 4.66383 5.71463 4.66383 7C4.66383 8.28537 5.71277 9.33433 6.99812 9.33433C8.28346 9.33433 9.3324 8.28537 9.3324 7C9.3324 5.71463 8.28346 4.66567 6.99812 4.66567ZM13.9992 7C13.9992 6.03335 14.008 5.07545 13.9537 4.11055C13.8994 2.98979 13.6437 1.99512 12.8242 1.17556C12.0029 0.35426 11.01 0.100338 9.88927 0.0460516C8.92263 -0.00823506 7.96475 0.000520879 6.99987 0.000520879C6.03323 0.000520879 5.07536 -0.00823506 4.11047 0.0460516C2.98973 0.100338 1.99508 0.356011 1.17554 1.17556C0.354253 1.99687 0.100336 2.98979 0.0460508 4.11055C-0.00823491 5.0772 0.00052087 6.0351 0.00052087 7C0.00052087 7.9649 -0.00823491 8.92455 0.0460508 9.88945C0.100336 11.0102 0.356004 12.0049 1.17554 12.8244C1.99683 13.6457 2.98973 13.8997 4.11047 13.9539C5.07711 14.0082 6.03499 13.9995 6.99987 13.9995C7.9665 13.9995 8.92438 14.0082 9.88927 13.9539C11.01 13.8997 12.0047 13.644 12.8242 12.8244C13.6455 12.0031 13.8994 11.0102 13.9537 9.88945C14.0097 8.92455 13.9992 7.96665 13.9992 7ZM6.99812 10.5917C5.01056 10.5917 3.40651 8.98759 3.40651 7C3.40651 5.01241 5.01056 3.40832 6.99812 3.40832C8.98567 3.40832 10.5897 5.01241 10.5897 7C10.5897 8.98759 8.98567 10.5917 6.99812 10.5917ZM10.7368 4.10004C10.2728 4.10004 9.89802 3.72529 9.89802 3.26122C9.89802 2.79716 10.2728 2.42241 10.7368 2.42241C11.2009 2.42241 11.5756 2.79716 11.5756 3.26122C11.5758 3.37142 11.5542 3.48056 11.5121 3.58239C11.47 3.68422 11.4082 3.77675 11.3303 3.85467C11.2523 3.93258 11.1598 3.99437 11.058 4.03647C10.9562 4.07858 10.847 4.10018 10.7368 4.10004Z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@syriasouq_official?_t=ZS-90myT93tVCB&_r=1" target="_blank" rel="noopener noreferrer" className="box-icon w-40 social">
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
              <span> تابعونا</span>
            </div>
            <div className="footer-logo">
              <Link to={`/`}>
                <img
                  alt="logo"
                  height={48}
                  src="/images/logo/Horizontal Yellow White 1.svg"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="inner-footer">
        <div className="container">
          <div dir="rtl" className="row">
            {footerSections.map((section, index) => (
              <div key={index} className="col-lg-2 col-md-6">
                <div className={`footer-cl-${index + 2} footer-col-block`}>
                  <div
                    style={{ textAlign: "right" }}
                    className="fw-7 text-white footer-heading-mobile"
                  >
                    {section.heading}
                  </div>
                  <div className="tf-collapse-content">
                    <ul className="mt-10 navigation-menu-footer">
                      {section.links.map((link, linkIndex) => (
                        <li style={{ textAlign: "right" }} key={linkIndex}>
                          <Link
                            to={link.href}
                            className="caption-1 text-variant-2"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-lg-4 col-md-6  justify-end">
              <div className="footer-cl-1 m-0">
                <p style={{ textAlign: "right" }} className="text-variant-2">
                  معلومات التواصل
                </p>
                <ul className="mt-12">
                  <li
                    style={{ justifyContent: "start" }}
                    className="mt-12 d-flex flex-row-reverse align-items-center gap-8"
                  >
                    <p className="text-white  fw-light">
                      101 شارع 92، شرق حلب، سوريا
                    </p>
                    <Location01Icon size={16} color="white" />
                  </li>
                  <li
                    style={{ justifyContent: "start" }}
                    className="mt-12 d-flex flex-row-reverse  gap-8"
                  >
                    <p dir="ltr" className="text-white caption-1 fw-light">
                      +963951501948
                    </p>
                    <Call02Icon size={16} color="white" />
                  </li>
                  <li
                    style={{ justifyContent: "start" }}
                    className="mt-12 d-flex flex-row-reverse align-items-center gap-8"
                  >
                    <p className="text-white caption-1 fw-light">
                      info@syr-souq.com
                    </p>
                    <Mail01Icon size={16} color="white" />
                  </li>
                </ul>
                <div className="mt-16">
                  <p style={{ textAlign: "right" }} className="text-variant-2 mb-8">
                    حمل التطبيق
                  </p>
                  <div className="d-flex flex-column gap-8">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.syriasouq.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center gap-8"
                      style={{ textDecoration: "none" }}
                    >
                      <img
                        src="/images/app-store/google-play.svg"
                        alt="Google Play"
                        style={{ height: "40px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "inline";
                        }}
                      />
                      <span className="text-white caption-1" style={{ display: "none" }}>
                        Google Play
                      </span>
                    </a>
                    <a
                      href="https://apps.apple.com/tr/app/%D8%B3%D9%88%D9%82-%D8%B3%D9%88%D8%B1%D9%8A%D8%A7/id6751295790"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center gap-8"
                      style={{ textDecoration: "none" }}
                    >
                      <img
                        src="/images/app-store/app-store.svg"
                        alt="App Store"
                        style={{ height: "40px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "inline";
                        }}
                      />
                      <span className="text-white caption-1" style={{ display: "none" }}>
                        App Store
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-footer">
        <div className="container">
          <div className="content-footer-bottom">
            <div className="copyright">
              ©{new Date().getFullYear()} Syria Souq جميع حقوق النشر محفوظة
              لشركة
            </div>
            <ul className="menu-bottom">
              {/* <li>
                <Link to={`/our-service`}>شروط الخدمة</Link>
              </li> */}
              <li>
                <Link to={`/privacy-policy`}>سياسة الخصوصية </Link>
              </li>
              {/* <li>
                <Link to={`/contact`}>سياسة ملفات الارتباط</Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
