import remarkWikiLink from "remark-wiki-link";
import { visit } from "unist-util-visit";

export function rehypeModifyWikiLinks() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "a") return;
      const isWikiLink = (node.properties?.className || []).includes(
        "wiki-link",
      );
      if (!isWikiLink) return;
      const rawWikiLinkText = node.children[0];
      const [_wiki_title, alias, _slug] = rawWikiLinkText.value.split("|");
      node.children = [
        {
          type: "text",
          value: alias.trim(),
        },
      ];
    });
  };
}

export function remarkCustomWikiLinkResolver() {
  return remarkWikiLink.call(this, {
    pageResolver: (name) => {
      // name is the contents in the wiki link
      // e.g. name of [[File title | Human Title | post-slug]] is "File title | Human Title | post-slug"
      // and we modify it into "File title|Human Title|post-slug"
      return [name.toLowerCase().replaceAll(" | ", "|")];
    },
    hrefTemplate: (permalink) => {
      // permalink is the result of pageResolver
      const [_title, _alias, slug] = permalink.split("|");
      return `/${slug}`;
    },
    wikiLinkClassName: "wiki-link",
  });
}
