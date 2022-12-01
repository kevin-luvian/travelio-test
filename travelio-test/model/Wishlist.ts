import mongoose from "../pkg/db/mongo";

export class IWishList extends mongoose.Document {
  id!: string;
  title!: string;
  thumbnail!: string;
  authors!: Array<string>;
  rating!: number;
}

const schema = new mongoose.Schema<IWishList>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  authors: [{ type: String, required: true }],
  rating: { type: Number, required: true },
});

var Singleton = (function () {
  var instance: mongoose.Model<IWishList>;

  function createInstance() {
    try {
      return mongoose.models.wishlist || mongoose.model("wishlist", schema);
    } catch (err) {
      throw new Error("connection refused");
    }
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

const WishListModel = Singleton.getInstance();

export default WishListModel;
