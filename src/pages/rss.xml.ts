import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { getImage } from "astro:assets"
import type { APIContext } from "astro"

export async function GET(context: APIContext) {
  const posts = await getCollection("posts")
  const images = posts.map(async (post) => {
    if (post.data.image) {
      return await getImage({ src: post.data.image })
    } else {
      return null
    }
  })
  const items = posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    description: post.data.categories.join(","),
    link: `/blog/${post.id}/`,
    enclosure: {
      url: `${JSON.stringify(post.data.image?.src)}`,
      // url: `${post.data.image}`,
      type: "image/jpeg",
      length: 1000000,
    },
  }))

  let site = "https://idealagent.com/"
  if (context.site?.href) {
    site = context.site.href
  }
  return rss({
    title: "IDEAL AGENT: The Real Estate Blog",
    description:
      "IDEAL AGENT: Top Local Agents Sell Your Home For 2% Commission.  Our blog discusses the latest real estate news, advice for selling and buying a home, choosing an agent and much more.",
    site: site,
    items: items,
  })
}
