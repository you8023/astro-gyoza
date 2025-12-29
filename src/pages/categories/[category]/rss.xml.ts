import type { APIContext, GetStaticPaths } from 'astro'
import rss from '@astrojs/rss'
import { site } from '@/config.json'
import { getSortedPosts, getAllCategories, slugify } from '@/utils/content'

export const getStaticPaths = (async () => {
  const allCategories = await getAllCategories()
  return allCategories.map((category) => ({
    params: { category: category.slug },
  }))
}) satisfies GetStaticPaths

export async function GET(context: APIContext) {
  const categorySlug = context.params?.category as string
  const sortedPosts = await getSortedPosts()
  const items = sortedPosts
    .filter((post) => post.data.category && slugify(post.data.category) === categorySlug)
    .map((post) => ({
      link: post.data.url ? post.data.url : `/posts/${post.slug}`,
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
    }))

  return rss({
    title: `${site.title} · 分类 · ${categorySlug}`,
    description: site.description,
    site: context.site!,
    items,
    customData: `<language>${site.lang}</language>`,
  })
}
