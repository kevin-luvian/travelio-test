import { NextPage } from "next";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useEffect, useState } from "react";

interface Props {
  search: string;
  onChange: (s: string) => void;
}

const SearchInput: NextPage<Props> = ({ search = "", onChange }) => {
  const [temp, setTemp] = useState(search);
  const [timeoutID, setTimeoutID] = useState<NodeJS.Timeout>();

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(temp);
    }, 500);
    setTimeoutID(handler);

    return () => {
      clearTimeout(handler);
    };
  }, [temp]);

  const forceSearch = (s: string) => {
    clearTimeout(timeoutID);
    onChange(s);
  };

  return (
    <Input.Search
      value={temp}
      onChange={(e) => setTemp(e.target.value)}
      onSearch={forceSearch}
      placeholder="search"
    />
  );
};

export default SearchInput;
