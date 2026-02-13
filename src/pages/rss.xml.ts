import rss from "@astrojs/rss";
import { DESCRIPTION, SITE, TITLE } from "@Models/GeneralModels";
import { RSS_POSTS } from "@Tools/post";

export async function GET() {
  return rss({
    title: TITLE,
    description: DESCRIPTION,
    site: SITE,
    items: RSS_POSTS,
  });
}
