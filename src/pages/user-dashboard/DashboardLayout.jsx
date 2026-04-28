import React, { useState, useEffect } from "react";
import { Layout, Menu, theme, Dropdown, Divider } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FavouriteIcon,
  Logout02Icon,
  Megaphone02Icon,
  UserIcon,
  Cancel01Icon,
  Money02Icon,
  Menu11Icon,
  Home01Icon,
  House01Icon,
  Car02Icon,
  FlashIcon,
} from "hugeicons-react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import OvalLoader from "@/components/OvalLoader";
import { logout, checkAuthStatus, fetchProfile } from "@/redux/actions/authActions";
import authService from "@/services/authService";


const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 991);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [selectedKey, setSelectedKey] = useState("dashboard/profile");
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { checkingAuth } = useSelector((state) => state.auth);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 991;
      setIsMobile(isSmallScreen);
      if (isSmallScreen) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const path =
      location.pathname.split("dashboard/")[1] || "dashboard/profile";
    setSelectedKey(path);
  }, [location]);

  // Handle Google OAuth authentication on dashboard
  useEffect(() => {
    const handleGoogleAuth = async () => {
      console.log('🔍 Dashboard: Checking for Google OAuth parameters...');
      console.log('🔍 Dashboard: Current URL:', window.location.href);

      const urlParams = new URLSearchParams(window.location.search);
      const authToken = urlParams.get('auth_token');
      const authError = urlParams.get('auth_error');

      console.log('🔍 Dashboard: auth token:', authToken);
      console.log('🔍 Dashboard: auth error:', authError);

      // If no OAuth parameters, don't do anything (user is already on dashboard)
      if (!authToken && !authError) {
        console.log('🔍 Dashboard: No OAuth parameters found, user is already on dashboard');
        return;
      }

      // If user is already authenticated and there are no OAuth parameters, don't redirect
      if (isAuthenticated && !authToken && !authError) {
        console.log('🔍 Dashboard: User is already authenticated, staying on dashboard');
        return;
      }

      // If we have an auth_token, process it (even if tokens already exist)
      // This ensures we always honor the latest OAuth result

      // Check for auth_success first (even if there's an error, success takes priority)
      const authSuccess = urlParams.get('auth_success');
      console.log('🔍 Dashboard: auth success:', authSuccess);

      // If we have an auth_token, treat it as a success (even without auth_success parameter)
      if (authToken) {
        console.log('🔍 Dashboard: Processing successful Google OAuth...');
        console.log('🔍 Dashboard: Raw auth_token:', authToken);
        console.log('🔍 Dashboard: Encoded auth_token:', encodeURIComponent(authToken));

        try {
          const apiUrl = `http://localhost:8000/api/auth/google/result?token=${encodeURIComponent(authToken)}`;
          console.log('🔍 Dashboard: API URL:', apiUrl);

          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            credentials: 'include',
          });

          console.log('🔍 Dashboard: Response status:', response.status);
          console.log('🔍 Dashboard: Response headers:', response.headers);

          const data = await response.json();
          console.log('🔍 Dashboard: auth result response:', data);

          if (data.success) {
            // Store tokens and user data
            if (data.access_token) {
              localStorage.setItem('access_token', data.access_token);
            }
            if (data.refresh_token) {
              localStorage.setItem('refresh_token', data.refresh_token);
            }
            if (data.user) {
              localStorage.setItem('user', JSON.stringify(data.user));
            }

            console.log('✅ Dashboard: Tokens stored successfully');

            // Notify other listeners that login occurred to update Redux immediately
            try {
              localStorage.setItem('app_login', Date.now().toString());
              setTimeout(() => localStorage.removeItem('app_login'), 50);
            } catch (e) { }

            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);

            // Update Redux state
            try {
              await dispatch(checkAuthStatus());
              await dispatch(fetchProfile());
              console.log('✅ Dashboard: Redux state updated successfully');
            } catch (reduxError) {
              console.error('❌ Dashboard: Redux state update failed:', reduxError);
              // Even if Redux fails, we have the tokens stored, so continue
            }

            console.log('✅ Dashboard: Authentication completed successfully');

            // Clear URL parameters without reloading
            console.log('🔄 Dashboard: Clearing URL parameters and staying on dashboard...');
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          } else {
            console.error('❌ Dashboard: auth failed despite success parameter:', data.error);
            // Clear URL parameters and redirect to login
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate('/auth/login', { replace: true });
            return;
          }
        } catch (error) {
          console.error('❌ Dashboard: auth error:', error);
          // Clear URL parameters and redirect to login
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate('/auth/login', { replace: true });
          return;
        }
      }

      if (authError) {
        console.error('❌ Dashboard: auth error detected:', authError);
        console.error('❌ Dashboard: Full URL:', window.location.href);
        console.error('❌ Dashboard: Search params:', window.location.search);

        // Handle specific error codes
        let errorMessage = 'Authentication failed. Please try again.';

        switch (authError) {
          case 'invalid_data':
            errorMessage = 'Invalid user data from Google. Please try again.';
            break;
          case 'invalid_state':
            errorMessage = 'Invalid authentication state. Please try again.';
            break;
          case 'true':
            errorMessage = 'Authentication failed. Please try again.';
            break;
          default:
            errorMessage = authError;
        }

        console.error('❌ Dashboard: Error message:', errorMessage);

        // Clear URL parameters and redirect to login
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate('/auth/login', { replace: true });
        return;
      }

    };

    handleGoogleAuth();
  }, [dispatch, navigate]);

  const menuItems = [
    {
      key: "profile",
      icon: <UserIcon size={18} />,
      label: "الملف الشخصي",
      onClick: () => navigate("/dashboard/profile"),
    },
    {
      key: "my-advertisements",
      icon: <Megaphone02Icon size={18} />,
      label: "إعلاناتي",
      onClick: () => navigate("/dashboard/my-advertisements"),
    },
    // {
    //   key: "my-premium-ads",
    //   icon: <FlashIcon size={18} />,
    //   label: "إعلاناتي المميزة",
    //   onClick: () => navigate("/dashboard/my-premium-ads"),
    // },
    {
      key: "subscription",
      icon: <Money02Icon size={18} />,
      label: "إشتراكاتي",
      onClick: () => navigate("/dashboard/subscription"),
    },
    {
      key: "favorite-ads",
      icon: <FavouriteIcon size={18} />,
      label: "الإعلانات المفضلة",
      onClick: () => navigate("/dashboard/favorite-ads"),
    },
    {
      key: "logout",
      icon: <Logout02Icon size={18} />,
      label: "تسجيل الخروج",
      onClick: () => dispatch(logout(navigate)),
      danger: true,
    },
  ];
  const userMenuItems = [
    {
      key: "logout",
      icon: <Logout02Icon size={18} />,
      label: "تسجيل الخروج",
      onClick: () => dispatch(logout(navigate)),
      danger: true,
    },
  ];

  const defaultItems = [
    {
      key: "home",
      icon: <Home01Icon size={18} />,
      label: "الصفحة الرئيسية",
      onClick: () => navigate("/"),
    },
    {
      key: "estates",
      icon: <House01Icon size={18} />,
      label: "عقارات",
      children: [
        {
          key: "houses",
          label: "منازل",
          onClick: () => navigate("/houses"),
        },
        {
          key: "lands",
          label: "أراضي",
          onClick: () => navigate("/lands"),
        },
      ],
    },
    {
      key: "vehicles",
      icon: <Car02Icon size={18} />,
      label: "مركبات",
      children: [
        {
          key: "cars",
          label: "سيارات",
          onClick: () => navigate("/cars"),
        },
        {
          key: "motorcycles",
          label: "دراجات نارية",
          onClick: () => navigate("/motorcycles"),
        },
        {
          key: "marines",
          label: "مركبات بحرية",
          onClick: () => navigate("/marines"),
        },
      ],
    },
  ];

  const sidebarStyle = {
    overflow: "auto",
    height: "100vh",
    position: "fixed",
    right: collapsed && isMobile ? "-250px" : 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    transition: "right 0.4s ease",
    display: "flex",
    flexDirection: "column",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    display: !collapsed && isMobile ? "block" : "none",
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div style={overlayStyle} onClick={() => setCollapsed(true)} />

      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        width={250}
        style={sidebarStyle}
      >
        <div
          style={{
            height: "5rem",
          }}
          className="d-flex align-items-center justify-content-center"
        >
          {collapsed ? (
            <img
              style={{
                padding: "1rem",
                width: "4.5rem",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/");
              }}
              src="/images/logo/solo_logo.png"
            />
          ) : (
            <img
              style={{
                width: "13rem",
                padding: "1rem 2rem",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/");
              }}
              src="/images/logo/Black RTL 1.png"
            />
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          className="user-dashboard-menu"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ padding: "8px 0", flex: 1 }}
        />
        <Divider style={{ margin: "0px 0px" }} />
        <Menu
          theme="light"
          mode="inline"
          className="user-dashboard-menu"
          items={defaultItems}
          style={{ padding: "8px 0 0" }}
        />
      </Sider>
      <Layout
        style={{
          marginRight: isMobile ? 0 : collapsed ? 80 : 250,
          transition: "margin-right 0.2s",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 10,
            width: "100%",
            display: "flex",
            alignItems: "center",
            height: "5rem",
            justifyContent: "space-between",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
          }}
        >
          <span
            style={{
              cursor: "pointer",
            }}
            onClick={() => setCollapsed(!collapsed)}
            className=" d-flex p-0 ms-2 align-items-center justify-content-center"
          >
            {collapsed ? <Menu11Icon size={26} /> : <Cancel01Icon size={26} />}
          </span>
          <div className="px-4">
            {checkingAuth ? (
              <div
                style={{
                  width: "100%",
                }}
                className="d-flex align-items-center justify-content-center"
              >
                <OvalLoader />
              </div>
            ) : (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                disabled={userMenuItems.length === 0}
              >
                <div
                  style={{
                    cursor: "pointer",
                  }}
                  className="d-flex align-items-center gap-2"
                >
                  <div
                    style={{
                      height: "2.5rem",
                      width: "2.5rem",
                      overflow: "hidden",
                    }}
                    className="rounded-pill border-0 bg-dark p-0 d-flex justify-content-center align-items-center"
                  >
                    {user?.image ? (
                      <img
                        src={user?.image ? user?.image : <UserIcon />}
                        alt="User Avatar"
                        className="w-100 h-100"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    ) : (
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
                    )}
                  </div>
                  <div className="d-flex flex-column gap-1 account-dashboard">
                    <p
                      style={{
                        lineHeight: "1rem",
                      }}
                      className="m-0 fw-normal text-variant-1"
                    >
                      اهلاً بعودتك,
                    </p>
                    <span
                      title={user?.name}
                      style={{
                        lineHeight: "1rem",
                      }}
                      className="fs-6 fw-bolder "
                    >
                      {user?.name
                        ? user.name.split(" ")[0].slice(0, 10) +
                        (user.name.split(" ")[0].length > 10 ? "..." : "")
                        : ""}
                    </span>
                  </div>
                </div>
              </Dropdown>
            )}
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
