
export type Category = {
  idx: number;
  name: string;
  alias: string;
  path: string;
};

export type Article = {
  idx: number;
  catIdx: number;
  name: string;
  alias: string;
  created: string;
  body: string
};