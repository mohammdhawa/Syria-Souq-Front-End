import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyPremiumAds } from "@/redux/actions/premiumAdsActions";
import { Table, Tag, Typography, Pagination, Empty, Breadcrumb, Tooltip } from "antd";
import { FlashIcon, HelpCircleIcon } from "hugeicons-react";
import MetaComponent from "@/components/common/MetaComponent";
import ComponentLoader from "@/components/ComponentLoader";
import OvalLoader from "@/components/OvalLoader";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import { getCategoryUrlName } from "@/utils/categoryMapping";

const { Title } = Typography;

const MyPremiumAdsPage = () => {
    const dispatch = useDispatch();
    const { premiumAds, pagination, loading } = useSelector((state) => state.premiumAds);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getMyPremiumAds(currentPage));
    }, [dispatch, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            width: 60,
            align: "center",
        },
        {
            title: "الإعلان",
            dataIndex: "advertisement",
            key: "advertisement",
            render: (ad) => (
                <Link
                    to={`/${getCategoryUrlName(ad?.category?.name || "category")}/${ad?.type || "type"}/${ad?.id}/${ad?.slug}`}
                    className="text-dark fw-bold"
                >
                    {ad?.title}
                </Link>
            ),
        },
        {
            title: "الحالة",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status, record) => {
                const isActive = record.is_active;
                return (
                    <Tag color={isActive ? "green" : "red"}>
                        {isActive ? "نشط" : "منتهي"}
                    </Tag>
                );
            },
        },
        {
            title: "تاريخ البدء",
            dataIndex: "starts_at",
            key: "starts_at",
            align: "center",
            render: (date) => moment(date).format("DD/MM/YYYY"),
        },
        {
            title: "تاريخ الانتهاء",
            dataIndex: "ends_at",
            key: "ends_at",
            align: "center",
            render: (date) => moment(date).format("DD/MM/YYYY"),
        },
        {
            title: "الأيام",
            dataIndex: "days",
            key: "days",
            align: "center",
        },
        {
            title: "التكلفة",
            dataIndex: "total_amount",
            key: "total_amount",
            align: "center",
            render: (amount) => `$${amount}`,
        },
    ];

    const metadata = {
        title: "Syria Souq | إعلاناتي المميزة",
    };

    return (
        <>
            <MetaComponent meta={metadata} />

            <div className="w-100 mb-4 d-flex align-items-center justify-content-between myads-page-header gap-3">
                <div className="d-flex align-items-start flex-column">
                    <span className="fs-4 fw-bold mb-1">إعلاناتي المميزة</span>
                    <Breadcrumb
                        items={[{ title: "لوحة التحكم" }, { title: "إعلاناتي المميزة" }]}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3 p-3 shadow-sm">
                <Table
                    columns={columns}
                    dataSource={premiumAds}
                    rowKey="id"
                    loading={{
                        spinning: loading,
                        indicator: <OvalLoader height={50} primary="#ffe800" />,
                    }}
                    pagination={false}
                    locale={{
                        emptyText: <Empty description="لا توجد إعلانات مميزة حالياً" />,
                    }}
                    scroll={{ x: 800 }}
                />

                {pagination?.total > 0 && (
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination
                            current={currentPage}
                            total={pagination.total}
                            pageSize={pagination.per_page}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default MyPremiumAdsPage;
