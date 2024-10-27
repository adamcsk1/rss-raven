export interface OneNews {
  id: string;
  title: string;
  content: string;
  link: string;
  favorite: boolean;
  read: boolean;
  feedId: string;
  date: string;
  image: string;
}

export type News = OneNews[];
