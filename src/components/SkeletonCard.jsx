import React from "react";
import { Card, Col, Row, Skeleton, Space } from "antd";
const SkeletonCard = () => {
  return (
    <Card
      style={{
        width: "100%",
        borderRadius: 10,
        overflow: "hidden",
      }}
      cover={<Skeleton.Image style={{ width: "100%", height: 240 }} active />}
    >
      <Skeleton
        active
        paragraph={false}
        title={{ width: "60%" }}
        style={{ marginBottom: 8 }}
      />

      <Skeleton
        active
        paragraph={{ rows: 1, width: "80%" }}
        title={false}
        style={{ marginBottom: 16 }}
      />

      <Row style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Space direction="vertical">
            <Skeleton.Avatar
              active
              shape="square"
              size="large"
              style={{
                borderRadius: "4px",
              }}
            />
          </Space>
        </Col>
        <Col span={8}>
          <Space direction="vertical">
            <Skeleton.Avatar
              active
              shape="square"
              size="large"
              style={{
                borderRadius: "4px",
              }}
            />
          </Space>
        </Col>
        <Col span={8}>
          <Space direction="vertical">
            <Skeleton.Avatar
              active
              shape="square"
              size="large"
              style={{
                borderRadius: "4px",
              }}
            />
          </Space>
        </Col>
      </Row>

      <Row justify="space-between" align="middle">
        <Col>
          <Space>
            <Skeleton.Avatar active shape="circle" size="large" />
            <Skeleton.Input
              active
              style={{ width: "20px !important" }}
              size="small"
            />
          </Space>
        </Col>
        <Col>
          <Skeleton.Input active style={{ width: 10 }} size="small" />
        </Col>
      </Row>
    </Card>
  );
};

export default SkeletonCard;
