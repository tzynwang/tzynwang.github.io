import { findAndReplace } from "mdast-util-find-and-replace";

export function remarkCustomWikiLinkResolver() {
  return (tree) => {
    findAndReplace(tree, [
      // to match [[Wiki Link]]
      /\[\[(.*?)\]\]/g,
      // see https://github.com/syntax-tree/mdast-util-find-and-replace?tab=readme-ov-file#replacefunction
      (_match, content) => {
        const [_wiki, alias, slug] = content
          .split("|")
          .map((part) => part.trim());
        return {
          type: "link",
          url: `./${slug}`,
          children: [
            {
              type: "text",
              value: alias,
            },
          ],
          data: {
            hProperties: {
              className: ["custom-anchor-link"],
            },
          },
        };
      },
    ]);
  };
}
