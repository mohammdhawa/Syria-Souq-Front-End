import MetaComponent from "@/components/common/MetaComponent";
import ComponentLoader from "@/components/ComponentLoader";
import {
  fetchSingleAdvertisement,
  resetSingleAdvertisement,
  updateAdvertisement,
} from "@/redux/actions/myAdvertisementsActions";
import { Breadcrumb, Col, Divider, Row, Tooltip, Typography } from "antd";
import {
  CalendarUpload01Icon,
  DollarCircleIcon,
  Megaphone02Icon,
} from "hugeicons-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import AdDescription from "./AdDescription";
import AdProperties from "./AdProperties";
import AdFeatures from "./AdFeatures";
import moment from "moment-timezone";
import {
  getStatusIcon,
  statusTranslations,
} from "../MyAdvertisementsColumns";
import AdVideo from "./AdVideo";
import AdLocation from "./AdLocation";
import AdEditMode from "./AdEditMode";

const getStatusColor = (status) => {
  switch (status) {
    case "accepted":
      return {
        color: "#389e0d",
        bgColor: "#b7eb8f",
      };
    case "active":
      return {
        color: "#531dab",
        bgColor: "#d3adf7",
      };
    case "rejected":
      return {
        color: "#cf1322",
        bgColor: "#ffa39e",
      };
    case "inactive":
      return {
        color: "#1e1e1e",
        bgColor: "#f8f9fa",
      };
    case "pending":
      return {
        color: "#d48806",
        bgColor: "#ffe58f",
      };
    default:
      return {
        color: "default",
        bgColor: "default",
      };
  }
};

const ShowAd = () => {
  const { id, slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const {
    singleAdvertisement,
    singleAdvertisementLoading,
  } = useSelector((state) => state.myAdvertisements);

  useEffect(() => {
    dispatch(fetchSingleAdvertisement(id, slug, navigate));

    return () => {
      dispatch(resetSingleAdvertisement());
    };
  }, [dispatch, id, slug]);

  const handleUpdateAd = (formData) => {
    dispatch(updateAdvertisement(id, formData, navigate))
      .then(() => {
        setEditMode(false);
      })
      .catch((error) => {});
  };

  const metadata = {
    title: `Syria Souq | ${
      singleAdvertisement ? singleAdvertisement.title : id
    }`,
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      {singleAdvertisementLoading ? (
        <ComponentLoader />
      ) : singleAdvertisement ? (
        <>
          {!editMode && (
            <>
              <div style={{
                gap: "20px",
              }} className="w-100 mb-4  d-flex align-items-center justify-content-between myad-single-header">
                <div className="d-flex align-items-start flex-column ">
                  <Typography.Text className="fs-4 fw-bold mb-1">
                    {singleAdvertisement?.title}
                  </Typography.Text>
                  <Breadcrumb
                    items={[
                      {
                        title: "لوحة التحكم",
                      },
                      {
                        title: "إعلاناتي",
                        href: "/dashboard/my-advertisements",
                      },
                      {
                        title: (
                          <Tooltip title={singleAdvertisement?.title}>
                            {singleAdvertisement?.title?.length > 20
                              ? `${singleAdvertisement.title.slice(0, 20)}...`
                              : singleAdvertisement.title}
                          </Tooltip>
                        ),
                      },
                    ]}
                  />
                </div>
                {singleAdvertisement?.ads_status === "accepted" &&
                singleAdvertisement?.active_status === "inactive" ? (
                  <></>
                ) : (
                  <button
                    onClick={() => {
                      setEditMode(true);
                    }}
                    className="tf-btn d-flex align-items-center gap-2 justify-content-center primary text-dark"
                  >
                    <p>تعديل الإعلان</p>
                  </button>
                )}
              </div>
              <Divider />
            </>
          )}
          {!editMode ? (
            <>
              <ul className=" row g-4">
                <li className="item col-xl-3 col-md-4 col-sm-6 col-xs-6 d-flex align-items-center gap-3 ">
                  <a className="box-icon bg-light text-dark rounded-3 w-52 ">
                    <DollarCircleIcon />
                  </a>
                  <div className="d-flex flex-column">
                    <span className="label text-variant-1">السعر</span>
                    <span className="fw-bold fs-16">
                      $
                      {new Intl.NumberFormat("en-US").format(
                        singleAdvertisement?.price
                      )}
                    </span>
                  </div>
                </li>
                <li className="item col-xl-3 col-md-4 col-sm-6 col-xs-6 d-flex align-items-center gap-3 ">
                  <a className="box-icon bg-light text-dark rounded-3 w-52">
                    <CalendarUpload01Icon />
                  </a>
                  <div className="d-flex flex-column">
                    <span className="label text-variant-1">تاريخ الانشاء</span>
                    <span className="fw-bold fs-16">
                      {moment(singleAdvertisement?.created_at)
                        .tz("Europe/Istanbul")
                        .format("DD/MM/YYYY - HH:MM")}
                    </span>
                  </div>
                </li>
                <li className="item col-xl-3 col-md-4 col-sm-6 col-xs-6 d-flex align-items-center gap-3 ">
                  <a className="box-icon  bg-light text-dark rounded-3 w-52">
                    {getStatusIcon(singleAdvertisement?.ads_status, 24)}
                  </a>
                  <div className="d-flex flex-column">
                    <span className="label text-variant-1">حالة الإعلان</span>
                    <span className="fw-bold fs-16">
                      {statusTranslations[singleAdvertisement?.ads_status] ||
                        singleAdvertisement?.ads_status}
                    </span>
                  </div>
                </li>
                <li className="item col-xl-3 col-md-4 col-sm-6 col-xs-6 d-flex align-items-center gap-3 ">
                  <a className="box-icon rounded-3 text-dark bg-light w-52">
                    {getStatusIcon(singleAdvertisement?.active_status, 24)}
                  </a>
                  <div className="d-flex flex-column">
                    <span className="label text-variant-1">حالة النشاط</span>
                    <span className="fw-bold fs-16">
                      {statusTranslations[singleAdvertisement?.active_status] ||
                        singleAdvertisement?.active_status}
                    </span>
                  </div>
                </li>
                {singleAdvertisement?.activated_at && (
                  <li className="item col-xl-3 col-md-4 col-sm-6 col-xs-6 d-flex align-items-center gap-3 ">
                    <a className="box-icon bg-light text-dark rounded-3 w-52 text-dark">
                      <Megaphone02Icon />
                    </a>
                    <div className="d-flex flex-column">
                      <span className="label text-variant-1">تاريخ النشر</span>
                      <span className="fw-bold fs-16">
                        {moment(singleAdvertisement?.activated_at)
                          .tz("Europe/Istanbul")
                          .format("DD/MM/YYYY - HH:MM")}
                      </span>
                    </div>
                  </li>
                )}
              </ul>
              <Divider />
              <Row gutter={[80, 40]}>
                <Col xxl={12}>
                  <Row gutter={[40, 40]}>
                    <Col xs={24}>
                      <ImageSlider images={singleAdvertisement?.images} />
                    </Col>
                    <Col xs={24}>
                      <AdDescription
                        description={singleAdvertisement?.description}
                      />
                    </Col>
                    <Col xs={24}>
                      <AdVideo videoUrl={singleAdvertisement?.video_url} />
                    </Col>
                  </Row>
                </Col>

                <Col xxl={12}>
                  <Row gutter={[40, 40]}>
                    <Col xs={24}>
                      <AdProperties ad={singleAdvertisement} />
                    </Col>
                    <Col xs={24}>
                      <AdFeatures features={singleAdvertisement?.features} />
                    </Col>
                    <Col xs={24}>
                      <AdLocation ad={singleAdvertisement} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          ) : (
            <AdEditMode
              ad={singleAdvertisement}
              onUpdate={handleUpdateAd}
              setEditMode={setEditMode}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ShowAd;
