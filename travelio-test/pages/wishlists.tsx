import { Col, message, Row } from "antd";
import { useEffect } from "react";
import BookDetailCard from "../common/components/BookDetailCard";
import useWishlists from "../common/hooks/useWishlists";

function Page() {
  const { wishlists, toggleWishlist, success, error } = useWishlists();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: `failed retrieving wishlists: ${error}`,
      });
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      messageApi.open({ type: "success", content: success });
    }
  }, [success]);

  return (
    <>
      <div style={{ padding: ".5rem", width: "100%" }}>
        {contextHolder}
        <div style={{ overflow: "hidden" }}>
          <Row gutter={16} style={{ margin: "0", width: "100%" }}>
            {wishlists.map((w, i) => (
              <Col key={i} span={8} style={{ padding: ".5rem" }}>
                <BookDetailCard
                  title={w.title}
                  authors={w.authors}
                  thumbnail={w.thumbnail}
                  wished={true}
                  onWishToggle={() => toggleWishlist(w.id)}
                />
              </Col>
            ))}
          </Row>
          <p style={{ margin: "3rem auto", width: "fit-content" }}>
            end of page
          </p>
        </div>
      </div>
    </>
  );
}

export default Page;
