import "../styles/globals.scss";
import type { AppProps } from "next/app";

import React from "react";
import { Layout, Menu } from "antd";

import { HomeOutlined, HeartOutlined } from "@ant-design/icons";
const { Sider } = Layout;

import Link from "next/link";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible className="trvl-sider">
        <div className="logo">
          <b>Google Book List</b>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[router.pathname]}>
          <Menu.Item key="/">
            <HomeOutlined />
            <span>Home</span>
            <Link href="/" />
          </Menu.Item>
          <Menu.Item key="/wishlists">
            <HeartOutlined />
            <span>Wishlists</span>
            <Link href="/wishlists" />
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Layout>
  );
}
