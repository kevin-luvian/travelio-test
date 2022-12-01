import { Avatar, Button, Card, Col, Rate, Row, Space } from "antd";
import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

interface Props {
  title: string;
  authors: string[];
  thumbnail: string;
  wished: boolean;
  onWishToggle: () => void;
}

const BookDetailCard: NextPage<Props> = ({
  title,
  authors,
  thumbnail,
  wished,
  onWishToggle,
}) => {
  return (
    <Card
      hoverable
      cover={
        <img
          style={{
            margin: ".5rem auto",
            maxHeight: "15rem",
            width: "auto",
          }}
          alt="thumbnail"
          src={thumbnail}
        />
      }
      style={{
        cursor: "default",
      }}
    >
      <Card.Meta title={<>{title}</>} description={<>{authors.join(", ")}</>} />
      <div style={{ margin: "1rem" }} />

      <Row justify="space-between">
        <Col>
          {wished ? (
            <Button
              shape="round"
              icon={<HeartFilled />}
              size="middle"
              onClick={onWishToggle}
            />
          ) : (
            <Button
              shape="round"
              icon={<HeartOutlined />}
              size="middle"
              onClick={onWishToggle}
            />
          )}
        </Col>
        <Col>
          <Rate allowHalf disabled value={2.5} />
        </Col>
      </Row>
    </Card>
  );
};

export default BookDetailCard;
