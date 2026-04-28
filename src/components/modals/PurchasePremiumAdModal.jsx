import React, { useEffect, useState } from "react";
import { Modal, InputNumber, Button, Typography, Divider, Statistic, Descriptions } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getPricePerDay, purchasePremiumAd } from "@/redux/actions/premiumAdsActions";
import { FlashIcon, Money03Icon } from "hugeicons-react";
import OvalLoader from "@/components/OvalLoader";

const { Title, Text } = Typography;

const PurchasePremiumAdModal = ({ open, close, ad, navigate }) => {
    const dispatch = useDispatch();
    const { pricePerDay, currency, loading, purchaseLoading } = useSelector(
        (state) => state.premiumAds
    );
    const [days, setDays] = useState(7);

    useEffect(() => {
        if (open) {
            dispatch(getPricePerDay());
        }
    }, [open, dispatch]);

    const handlePurchase = async () => {
        if (!ad) return;

        try {
            await dispatch(purchasePremiumAd({
                advertisement_id: ad.id,
                days: days
            }, navigate));
            close();
        } catch (error) {
            // Error handled in action
        }
    };

    const totalCost = pricePerDay ? (pricePerDay * days).toFixed(2) : 0;

    return (
        <Modal
            open={open}
            onCancel={close}
            footer={null}
            title={
                <div className="d-flex align-items-center gap-2">
                    <FlashIcon size={24} className="text-warning" />
                    <span>ترقية الإعلان إلى مميز</span>
                </div>
            }
            centered
        >
            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <OvalLoader />
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    <div className="bg-light p-3 rounded-2">
                        <Text strong>الإعلان المختار:</Text>
                        <div className="mt-1">{ad?.title}</div>
                    </div>

                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="سعر اليوم الواحد">
                            {pricePerDay} {currency}
                        </Descriptions.Item>
                    </Descriptions>

                    <div>
                        <div className="mb-2">عدد الأيام:</div>
                        <InputNumber
                            min={1}
                            max={365}
                            value={days}
                            onChange={setDays}
                            className="w-100"
                            size="large"
                        />
                        <Text type="secondary" className="d-block mt-1">
                            الحد الأدنى يوم واحد، الحد الأقصى 365 يوم
                        </Text>
                    </div>

                    <Divider className="my-2" />

                    <div className="d-flex justify-content-between align-items-center">
                        <Text strong className="fs-5">الإجمالي:</Text>
                        <div className="d-flex align-items-center gap-1 text-primary">
                            <Money03Icon size={24} />
                            <span className="fs-4 fw-bold">{totalCost}</span>
                            <span className="fs-6">{currency}</span>
                        </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={handlePurchase}
                            loading={purchaseLoading}
                            className="bg-warning text-dark border-0"
                        >
                            تأكيد الشراء
                        </Button>
                        <Button size="large" block onClick={close}>
                            إلغاء
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default PurchasePremiumAdModal;
