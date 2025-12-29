import type { APIContext, GetStaticPaths } from 'astro'
import rss from '@astrojs/rss'
import { site } from '@/config.json'
import { getSortedPosts, getAllTags, slugify } from '@/utils/content'

export const getStaticPaths = (async () => {
  const allTags = await getAllTags()
  return allTags.map((tag) => ({
    params: { tag: tag.slug },
  }))
}) satisfies GetStaticPaths

export async function GET(context: APIContext) {
  const tagSlug = context.params?.tag as string
  const sortedPosts = await getSortedPosts()
  const items = sortedPosts
    .filter((post) => post.data.tags.findIndex((t) => slugify(t) === tagSlug) >= 0)
    .map((post) => ({
      link: post.data.url ? post.data.url : `/posts/${post.slug}`,
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
    }))

  return rss({
    title: `${site.title} · 标签 · ${tagSlug}`,
    description: site.description,
    site: context.site!,
    items,
    customData: `<language>${site.lang}</language>`,
  })
}
