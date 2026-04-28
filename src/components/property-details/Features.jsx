import { Col, Row, Tooltip } from "antd";
import { ArrowDown01Icon, ArrowUp01Icon, Tick02Icon } from "hugeicons-react";
import { useEffect, useState } from "react";

const styles = `
  .box-feature {
    transition: all 0.2s ease-in;
    overflow: hidden;
  }
  .box-feature.hidden {
    height: 0;
    opacity: 0;
    padding: 0;
    margin: 0;
  }
  .box-feature.visible {
    height: auto;
    opacity: 1;
  }
`;

export default function Features({ features, category }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
  const [visibleGroups, setVisibleGroups] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const initialVisibility = {};
    features?.forEach((_, index) => {
      initialVisibility[index] = isMobile ? index === 0 : true; 
    });
    setVisibleGroups(initialVisibility);
  }, [features, isMobile]);

  const getCategoryTitle = (id) => {
    switch (id) {
      case 1:
      case 2:
        return "ميزات العقار";
      case 3:
        return "ميزات السيارة";
      case 4:
        return "ميزات المركبة";
      case 5:
        return "ميزات الدراجة";
      default:
        return "الميزات";
    }
  };

  const toggleGroupVisibility = (index) => {
    setVisibleGroups((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <style>{styles}</style>
      <h5 className="title fw-6">{getCategoryTitle(category?.id)}</h5>
      <div
        style={{
          gap: "1rem",
        }}
        className="d-flex flex-column gap-3 w-100"
      >
        {features?.map((featureGroup, index) => (
          <div className="w-100 d-flex flex-column gap-2" key={index}>
            <div className="w-100 d-flex align-items-center justify-content-between">
              <p className="fs-6 w-100 text-dark fw-bold">
                {featureGroup?.name}
              </p>
              <Tooltip title={visibleGroups[index] ? "إخفاء" : "عرض"}>
                <span
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                  }}
                  className=" bg-light d-flex align-items-center justify-content-center cursor-pointer extand-feature"
                  onClick={() => toggleGroupVisibility(index)}
                >
                  {visibleGroups[index] ? (
                    <ArrowUp01Icon size={16} />
                  ) : (
                    <ArrowDown01Icon size={16} />
                  )}
                </span>
              </Tooltip>
            </div>
            <div
              className={`box-feature w-100 bg-light rounded-3 ${
                visibleGroups[index] ? "visible" : "hidden"
              }`}
            >
              <Row>
                {featureGroup?.features?.map((feature, idx) => (
                  <Col xxl={8} xs={12} key={idx}>
                    <div className="d-flex gap-1 align-items-start p-4 fs-6">
                      <Tick02Icon size={18} color="green" strokeWidth={2} />
                      {isMobile && feature?.name?.length > 15 ? (
                        <Tooltip title={feature?.name}>
                          <li
                            style={{
                              listStyle: "none",
                            }}
                            className="feature-item fw-normal"
                          >
                            {feature?.name?.slice(0, 15)}...
                          </li>
                        </Tooltip>
                      ) : (
                        <li
                          style={{
                            listStyle: "none",
                          }}
                          className="feature-item fw-normal"
                        >
                          {feature?.name}
                        </li>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
