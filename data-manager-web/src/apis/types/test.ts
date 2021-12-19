/**
 * 测试接口interface
 */

export interface GetDemo {
  current: number;
  pageSize: number;
  title?: string;
  author?: string;
}

export interface PostDemo {
  id: string;
  title: string;
  content: string;
}

export type requestDemo = PostDemo

/**
 * 商品列表接口
 */
export interface GoodsListType {
  title: string;
  desc: string;
  tags: string[];
  num: number;
  price: number;
}
