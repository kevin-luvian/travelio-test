import WishListModel, { IWishList } from "../model/Wishlist";

export function FindByID(id: string): Promise<IWishList | null> {
  return WishListModel.findOne({ id: id }).exec();
}

export function FindAll(): Promise<Array<IWishList>> {
  return WishListModel.find({}).exec();
}

export function Create(data: IWishList): Promise<IWishList> {
  return WishListModel.create(data);
}

export function DeleteByID(id: string) {
  return WishListModel.deleteOne({ id: id }).exec();
}
