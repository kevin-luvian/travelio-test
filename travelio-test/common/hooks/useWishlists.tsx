import { useEffect, useState } from "react";
import { IWishList } from "../../model/Wishlist";
import { getErrorMessage } from "../../pkg/util/util";

export default function useWishlists() {
  const [wishlists, setWishlists] = useState<IWishList[]>([]);
  const [success, setSuccess] = useState<String | null>(null);
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    retrieveWishlists();
  }, []);

  const retrieveWishlists = async () => {
    try {
      setError(null);

      const res = await fetch(`/api/wishlists`);
      if (res.ok) {
        const jsonData = (await res.json()) as IWishList[];
        jsonData.sort((a, b) => a.title.localeCompare(b.title));
        setWishlists(jsonData);
      }
    } catch (err) {
      const errMsg = getErrorMessage(err);
      setError(errMsg);
    }
  };

  const toggleWishlist = async (id: string) => {
    try {
      const res = await fetch(`/api/wishlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        const msg = await res.text();
        setSuccess(msg);
        retrieveWishlists();
      }
    } catch (err) {
      const errMsg = getErrorMessage(err);
      setError(errMsg);
    }
  };

  return { wishlists, toggleWishlist, success, error };
}
