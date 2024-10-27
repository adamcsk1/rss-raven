export interface FeedAdd {
  url: string;
  categoryType: 'new' | 'existing';
  existingCategoryId: string;
  newCategoryName: string;
}
