import type { NextApiRequest, NextApiResponse } from "next";
import { plainToInstance, Expose } from "class-transformer";
import { getErrorMessage } from "../../pkg/util/util";
import * as WishListRepo from "../../repository/Wishlist";
import * as BookAPIRepo from "../../repository/BookAPI";
import { IWishList } from "../../model/Wishlist";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      HandlerGetWishlists(req, res);
      break;
    case "POST":
      await HandlerToggleWishlist(req, res);
      break;
    default:
      res.status(400).send("invalid routes");
  }
}

async function HandlerGetWishlists(
  req: NextApiRequest,
  res: NextApiResponse<IWishList[] | string>
) {
  try {
    const data = await WishListRepo.FindAll();
    res.status(200).json(data);
  } catch (err) {
    const errmsg = getErrorMessage(err);
    res.status(500).send(errmsg);
  }
}

class WishlistIDRequest {
  @Expose() id: string | undefined;
}

async function HandlerToggleWishlist(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const data = plainToInstance(WishlistIDRequest, req.body);
    if (data.id == undefined) {
      res.status(400).send("invalid request");
      return;
    }

    const prev = await WishListRepo.FindByID(data.id);
    if (prev != null) {
      const mdelete = await WishListRepo.DeleteByID(data.id);
      const deletedCount = mdelete?.deletedCount ?? 0;
      if (deletedCount == 1) {
        res.status(200).send("wishlist deleted");
      } else {
        res.status(500).send("failed to delete wishlist");
      }
      return;
    }

    const details = await BookAPIRepo.FindByID(data.id);
    await WishListRepo.Create(<IWishList>{
      id: details.id,
      title: details.title,
      authors: details.authors,
      rating: details.rating,
      thumbnail: details.thumbnail,
    });

    res.status(200).send("wishlist created");
  } catch (err) {
    const errmsg = getErrorMessage(err);
    res.status(500).send(errmsg);
  }
}
