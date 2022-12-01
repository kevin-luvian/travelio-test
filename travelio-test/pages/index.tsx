import { Badge, Col, message, Row } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../pkg/util/util";
import * as BookAPI from "../repository/BookAPI";
import BookDetailCard from "../common/components/BookDetailCard";
import { BookDetail } from "../model/BookAPI";
import SearchInput from "../common/components/SearchInput";
import useWishlists from "../common/hooks/useWishlists";

function Home() {
  const [param, setParam] = useState({ search: "", lastIndex: 0 });
  const [total, setTotal] = useState(0);
  const [books, setBooks] = useState<BookDetail[]>([]);
  const {
    wishlists,
    toggleWishlist,
    success: wishlistSuccess,
    error: wishlistError,
  } = useWishlists();

  const wishlistIDs = useMemo(() => {
    return wishlists.map((w) => w.id);
  }, [wishlists]);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;

      if (bottom) {
        setParam({
          search: param.search,
          lastIndex: books.length,
        });
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [param.search, books]);

  useEffect(() => {
    retrieveBooks();
  }, [param]);

  useEffect(() => {
    if (wishlistError) {
      messageApi.open({
        type: "error",
        content: `failed retrieving wishlists: ${wishlistError}`,
      });
    }
  }, [wishlistError]);

  useEffect(() => {
    if (wishlistSuccess) {
      messageApi.open({ type: "success", content: wishlistSuccess });
    }
  }, [wishlistSuccess]);

  const retrieveBooks = async () => {
    if (param.search == "") {
      return;
    }

    try {
      const res = await BookAPI.FindAll(param.search, param.lastIndex);
      messageApi.open({
        type: "success",
        content: `${res.books.length} books retrieved`,
      });

      setTotal(res.total);

      if (param.lastIndex == 0) {
        // set initial
        setBooks(res.books);
      } else {
        // append to books
        setBooks([...books, ...res.books]);
      }
    } catch (err) {
      const errMsg = getErrorMessage(err);
      messageApi.open({
        type: "error",
        content: `failed retrieving books: ${errMsg}`,
      });
    }
  };

  return (
    <>
      <div style={{ padding: ".5rem", width: "100%" }}>
        {contextHolder}
        <Row justify="end">
          <Col span={24} md={8}>
            <SearchInput
              search={param.search}
              onChange={(s) => {
                setParam({
                  search: s,
                  lastIndex: 0,
                });
              }}
            />
          </Col>
          <Col>
            <Badge
              showZero
              count={total}
              overflowCount={9999}
              style={{ marginLeft: "5px" }}
            />
          </Col>
        </Row>

        <div style={{ overflow: "hidden" }}>
          <Row gutter={16} style={{ margin: "0", width: "100%" }}>
            {books.map((b, i) => (
              <Col key={i} span={8} style={{ padding: ".5rem" }}>
                <BookDetailCard
                  title={b.title}
                  authors={b.authors}
                  thumbnail={b.thumbnail}
                  wished={wishlistIDs.includes(b.id)}
                  onWishToggle={() => toggleWishlist(b.id)}
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

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});
