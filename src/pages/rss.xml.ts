import rss from '@astrojs/rss';
import { TITLE, DESCRIPTION, SITE } from '@Models/GeneralModels';
import { RSS_POSTS } from '@Tools/post';

export async function get() {
  return rss({
    title: TITLE,
    description: DESCRIPTION,
    site: SITE,
    items: RSS_POSTS,
  });
}
