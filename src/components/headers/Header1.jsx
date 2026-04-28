import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import { RotatingLines } from "react-loader-spinner";
import { logout } from "@/redux/actions/authActions";

import Nav from "./Nav";
import MobileNav from "./MobileNav";
import {
  UserIcon,
  FavouriteIcon,
  ResourcesAddIcon,
  Settings02Icon,
  Logout02Icon,
  Megaphone02Icon,
  Invoice03Icon,
  Invoice01Icon,
  Money01Icon,
  DashboardSquareAddIcon,
} from "hugeicons-react";
import { LuUserRound } from "react-icons/lu";
import OvalLoader from "../OvalLoader";

export default function Header1({
  parentClass = "main-header header-fixed fixed-header",
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, profileLoading, loading, authChecked } =
    useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const items = [
    {
      label: (
        <Link to="/dashboard/profile" className="p-2 fs-16 lh-1">
          الملف الشخصي
        </Link>
      ),
      key: "0",
      icon: <UserIcon size={22} />,
    },
    {
      type: "divider",
    },
    {
      label: (
        <Link to="/dashboard/my-advertisements" className="p-2 fs-16 lh-1">
          إعلاناتي
        </Link>
      ),
      key: "2",
      icon: <Megaphone02Icon size={22} />,
    },
    {
      label: (
        <Link to="/publish-ad" className="p-2 fs-16 lh-1">
          نشر إعلان
        </Link>
      ),
      key: "6",
      icon: <DashboardSquareAddIcon size={22} />,
    },
    {
      label: (
        <Link to="/dashboard/subscription" replace className="p-2 fs-16 lh-1">
          إشتراكاتي
        </Link>
      ),
      key: "5",
      icon: <Money01Icon size={22} />,
    },
    {
      label: (
        <Link to="/dashboard/favorite-ads" className="p-2 fs-16 lh-1">
          الإعلانات المفضلة
        </Link>
      ),
      key: "1",
      icon: <FavouriteIcon size={22} />,
    },
    {
      type: "divider",
    },
    {
      label: (
        <a onClick={handleLogout} className="p-2 fs-16 lh-1">
          تسجيل الخروج
        </a>
      ),
      key: "4",
      icon: <Logout02Icon size={22} />,
      danger: true,
    },
  ];
  return (
    <header id="header" className={`${parentClass}`}>
      <div className="header-lower">
        <div className="row">
          <div className="col-lg-12">
            <div className="inner-header">
              <div className="inner-header-left">
                <div className="logo-box flex">
                  <div className="logo">
                    <Link to="/">
                      <img
                        alt="logo"
                        className="logo-1"
                        height={38}
                        src="/images/logo/Horizontal_Black.svg"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="nav-outer flex align-center">
                <nav className="main-menu show navbar-expand-md">
                  <div
                    className="navbar-collapse collapse clearfix"
                    id="navbarSupportedContent"
                  >
                    <ul
                      style={{ paddingRight: "4rem", gap: "4rem" }}
                      className="navigation clearfix d-flex"
                    >
                      <Nav />
                    </ul>
                  </div>
                </nav>
              </div>
              <div className="inner-header-right header-account">
                {!authChecked || (isAuthenticated && (loading || !user)) ? (
                  <div
                    style={{
                      minWidth: "7.5rem",
                    }}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <OvalLoader />
                  </div>
                ) : isAuthenticated ? (
                  <div
                    style={{ position: "relative" }}
                    className="user-dropdown"
                  >
                    <Dropdown
                      menu={{ items }}
                      overlayStyle={{
                        marginTop: "0.4rem",
                        width: "15rem",
                      }}
                      trigger={["click"]}
                      placement="bottom"
                      arrow
                      style={{ width: "8rem" }}
                    >
                      <div
                        className="user-info d-flex align-items-center gap-2"
                        style={{ cursor: "pointer" }}
                      >
                        {user?.image ? (
                          <img
                            src={user?.image}
                            alt={user?.name}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div className="avatar bg-light avt-40 round d-flex align-items-center justify-content-center">
                            <img
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transform: "scale(1.3)",
                              }}
                              src="/images/no_profile.png"
                              alt="No profile image"
                            />
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            lineHeight: "0",
                            gap: "1.1rem",
                          }}
                        >
                          <span
                            className="text-variant-1"
                            style={{ fontWeight: "light" }}
                          >
                            اهلا بعودتك,
                          </span>
                          <span
                            title={user?.name}
                            className="fs-6 fw-bold"
                            style={{ display: "block", lineHeight: "0" }}
                          >
                            {user?.name
                              ? user.name.split(" ")[0].slice(0, 10) +
                                (user.name.split(" ")[0].length > 10
                                  ? "..."
                                  : "")
                              : ""}
                          </span>
                        </div>
                      </div>
                    </Dropdown>
                  </div>
                ) : (
                  <Link
                    style={{
                      backgroundColor: "#1E1E1E",
                      color: "#fff",
                      width: "160px",
                      border: "1px solid #1E1E1E",
                      borderRadius: ".6rem",
                    }}
                    to={"/auth/login"}
                    className="tf-btn primary btn-login"
                  >
                    تسجيل الدخول
                  </Link>
                )}
              </div>
              <div
                style={{ textAlign: "left" }}
                className="mobile-nav-toggler mobile-button"
                onClick={() =>
                  document.body.classList.add("mobile-menu-visible")
                }
              >
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className="close-btn"
        onClick={() => document.body.classList.remove("mobile-menu-visible")}
      >
        <span className="icon flaticon-cancel-1" />
      </div>
      <div className="mobile-menu">
        <div className="menu-backdrop" />
        <nav className="menu-box">
          <div className="nav-logo d-flex justify-content-center">
            <Link to="/">
              <img
                alt="logo"
                className="logo-1"
                height={38}
                src="/images/logo/Horizontal_Black.svg"
              />
            </Link>
          </div>
          <div className="bottom-canvas">
            {!authChecked ? (
              <span>Loading...</span>
            ) : isAuthenticated ? (
              profileLoading || !user ? (
                <span>Loading...</span>
              ) : (
                <div
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/dashboard/profile");
                  }}
                  className="mobile-user-profile"
                >
                  <div className="d-flex align-items-center mb-3">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginLeft: "10px",
                        objectFit: "cover",
                      }}
                    >
                      {user?.image ? (
                        <img
                          src={user?.image}
                          alt="User Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
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
                      )}
                    </div>
                    <div>
                      <span style={{ fontWeight: "bold" }}>{user.name}</span>
                      <small style={{ display: "block", color: "#5C6368" }}>
                        {user.email}
                      </small>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="login-box flex align-center">
                <Link to="/auth/login">تسجيل الدخول</Link>
                <span> / </span>
                <Link to="/auth/signup">انشاء حساب</Link>
              </div>
            )}
            <div className="menu-outer">
              <MobileNav />
            </div>
            {!isAuthenticated && authChecked && (
              <div className="button-mobi-sell">
                <Link
                  className="tf-btn primary"
                  to="/publish-ad"
                  onClick={() =>
                    document.body.classList.remove("mobile-menu-visible")
                  }
                >
                  انشر إعلانك الآن
                </Link>
              </div>
            )}
            <div style={{ textAlign: "left" }} className="mobi-icon-box">
              <div className="box d-flex align-items-center">
                <div dir="ltr">+963951501948</div>
                <span className="icon icon-phone2" />
              </div>
              <div className="box d-flex align-items-center">
                <div>info@syr-souq.com</div>
                <span className="icon icon-mail" />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
