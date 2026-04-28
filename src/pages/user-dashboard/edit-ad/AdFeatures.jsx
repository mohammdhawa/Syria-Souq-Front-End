import { Alert, Col, Row, Tooltip } from "antd";
import { Tick02Icon } from "hugeicons-react";
import { useEffect, useState } from "react";

export default function AdFeatures({ features, category }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const getCategoryTitle = (id) => {
    switch (id) {
      case 1:
        return "ميزات العقار";
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

  return (
    <div className="d-flex flex-column gap-3">
      <h5 className="title fw-6">{getCategoryTitle(category?.id)}</h5>
      <div
        style={{
          gap: "1rem",
        }}
        className="d-flex flex-column  gap-3 w-100"
      >
        {features?.length > 0 ? (
          features?.map((featureGroup, index) => (
            <div className="w-100 d-flex flex-column gap-2" key={index}>
              <p className="fs-6 w-100 text-dark fw-bold">
                {featureGroup?.name}
              </p>
              <div className="box-feature w-100 bg-light rounded-3">
                <Row>
                  {featureGroup?.features?.map((feature, idx) => (
                    <Col xxl={8} xs={12} key={idx}>
                      <div className="d-flex gap-1 align-items-start p-4 fs-6">
                        <Tick02Icon size={18} color="green" strokeWidth={2} />
                        {isMobile && feature?.name?.length > 8 ? (
                          <Tooltip title={feature?.name}>
                            <li
                              style={{
                                listStyle: "none",
                              }}
                              className="feature-item fw-normal"
                            >
                              {feature?.name?.slice(0, 8)}...
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
          ))
        ) : (
          <Alert
            message={
              "لم تتم إضافة أي ميزات إضافية لإعلانك حتى الآن — أضف بعض الميزات لزيادة جاذبية إعلانك."
            }
            showIcon
            type="info"
          />
        )}
      </div>
    </div>
  );
}
