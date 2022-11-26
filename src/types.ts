
export type ProcessResult = {
  result: boolean;
  message: string;
}

// ====================================================
// Config Types
// ====================================================

export type ConfigObject = {
  databasePrefix: string;
  inputFolder: string;
  outputFolder: string;
  templateFileName?: string;
  gmtOffset?: number;
}

export type ConfigValidation = {
  propertyName: string;
  isRequired: boolean;
  isFilePath: boolean;
}

// ====================================================
// Category Type
// ====================================================

export type Category = {
  id: string;
  asset_id: string;
  parent_id: string;
  lft: string;
  rgt: string;
  level: string;
  path: string;
  extension: string;
  title: string;
  alias: string;
  note: string;
  description: string;
  published: string;
  checked_out: string;
  checked_out_time: string;
  access: string;
  params: string;
  metadesc: string;
  metakey: string;
  metadata: string;
  created_user_id: string;
  created_time: string;
  modified_user_id: string;
  modified_time: string;
  hits: string;
  language: string;
  version: string;
};

// Example data

// {
//   "id": "2",
//   "asset_id": "27",
//   "parent_id": "18",
//   "lft": "18",
//   "rgt": "19",
//   "level": "2",
//   "path": "category-posts\/category-blackberry",
//   "extension": "com_content",
//   "title": "BlackBerry",
//   "alias": "category-blackberry",
//   "note": "",
//   "description": "Category description",
//   "published": "1",
//   "checked_out": "0",
//   "checked_out_time": "0000-00-00 00:00:00",
//   "access": "1",
//   "params": "{\"category_layout\":\"\",\"image\":\"\",\"image_alt\":\"\"}",
//   "metadesc": "",
//   "metakey": "",
//   "metadata": "{\"author\":\"\",\"robots\":\"\"}",
//   "created_user_id": "0",
//   "created_time": "0000-00-00 00:00:00",
//   "modified_user_id": "62",
//   "modified_time": "2017-03-02 14:31:45",
//   "hits": "0",
//   "language": "*",
//   "version": "1"
// },


// ====================================================
// Article Types
// ====================================================
export type Article = {
  id: string;
  asset_id: string;
  title: string;
  alias: string;
  introtext: string;
  fulltext: string;
  state: string;
  catid: string;
  created: string;
  created_by: string;
  created_by_alias: string;
  modified: string;
  modified_by: string;
  checked_out: string;
  checked_out_time: string;
  publish_up: string;
  publish_down: string;
  images: ArticleImages;
  urls: ArticleUrls;
  attribs: ArticleAttribs;
  version: string;
  ordering: string;
  metakey: string;
  metadesc: string;
  access: string;
  hits: string;
  metadata: ArticleMetadata;
  featured: string;
  language: string;
  xreference: string;
  note: string;
  // Optional because this gets added later when exporting
  category_title?: string;
  category_alias?: string;
};

export type ArticleImages = {
  image_intro: string;
  float_intro: string;
  image_intro_alt: string;
  image_intro_caption: string;
  image_fulltext: string;
  float_fulltext: string;
  image_fulltext_alt: string;
  image_fulltext_caption: string;
}

export type ArticleUrls = {
  urla: boolean;
  urlatext: string;
  targeta: string;
  urlb: boolean;
  urlbtext: string;
  targetb: string;
  urlc: boolean;
  urlctext: string;
  targetc: string;
}

export type ArticleAttribs = {
  article_layout: string;
  show_title: string;
  link_titles: string;
  show_tags: string;
  show_intro: string;
  info_block_position: string;
  info_block_show_title: string;
  show_category: string;
  link_category: string;
  show_parent_category: string;
  link_parent_category: string;
  show_associations: string;
  show_author: string;
  link_author: string;
  show_create_date: string;
  show_modify_date: string;
  show_publish_date: string;
  show_item_navigation: string;
  show_icons: string;
  show_print_icon: string;
  show_email_icon: string;
  show_vote: string;
  show_hits: string;
  show_noauth: string;
  urls_position: string;
  alternative_readmore: string;
  article_page_title: string;
  show_publishing_options: string;
  show_article_options: string;
  show_urls_images_backend: string;
  show_urls_images_frontend: string;
}

export type ArticleMetadata = {
  robots: string;
  author: string;
  rights: string;
  xreference: string;
}

// Example data

// {
//   "id": "555",
//   "asset_id": "721",
//   "title": "Site Upgrade Coming",
//   "alias": "site-upgrade-coming",
//   "introtext": article content",
//   "fulltext": "",
//   "state": "1",
//   "catid": "9",
//   "created": "2022-11-11 22:26:30",
//   "created_by": "62",
//   "created_by_alias": "",
//   "modified": "2022-11-11 22:26:30",
//   "modified_by": "0",
//   "checked_out": "0",
//   "checked_out_time": "0000-00-00 00:00:00",
//   "publish_up": "2022-11-11 22:26:30",
//   "publish_down": "0000-00-00 00:00:00",
//   "images": "{\"image_intro\":\"\",\"float_intro\":\"\",\"image_intro_alt\":\"\",\"image_intro_caption\":\"\",\"image_fulltext\":\"\",\"float_fulltext\":\"\",\"image_fulltext_alt\":\"\",\"image_fulltext_caption\":\"\"}",
//   "urls": "{\"urla\":false,\"urlatext\":\"\",\"targeta\":\"\",\"urlb\":false,\"urlbtext\":\"\",\"targetb\":\"\",\"urlc\":false,\"urlctext\":\"\",\"targetc\":\"\"}",
//   "attribs": "{\"article_layout\":\"\",\"show_title\":\"\",\"link_titles\":\"\",\"show_tags\":\"\",   \"show_intro\":\"\",\"info_block_position\":\"\",\"info_block_show_title\":\"\",\"show_category\":\"\",\"link_category\":\"\",\"show_parent_category\":\"\",\"link_parent_category\":\"\",\"show_associations\":\"\",\"show_author\":\"\",\"link_author\":\"\",\"show_create_date\":\"\",\"show_modify_date\":\"\",\"show_publish_date\":\"\",\"show_item_navigation\":\"\",\"show_icons\":\"\",\"show_print_icon\":\"\",\"show_email_icon\":\"\",\"show_vote\":\"\",\"show_hits\":\"\",\"show_noauth\":\"\",\"urls_position\":\"\",\"alternative_readmore\":\"\",\"article_page_title\":\"\",\"show_publishing_options\":\"\",\"show_article_options\":\"\",\"show_urls_images_backend\":\"\",\"show_urls_images_frontend\":\"\"}",
//   "version": "1",
//   "ordering": "0",
//   "metakey": "",
//   "metadesc": "",
//   "access": "1",
//   "hits": "0",
//   "metadata": "{\"robots\":\"\",\"author\":\"\",\"rights\":\"\",\"xreference\":\"\"}",
//   "featured": "1",
//   "language": "*",
//   "xreference": "",
//   "note": ""
// }
