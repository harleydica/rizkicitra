import CustomImage from '@/components/atoms/CustomImage'
import MDXComponents from '@/components/organism/MDXComponents'
import ContentImage from '@/components/organism/MDXComponents/ContentImage'
import Layout from '@/components/templates/Layout'

import { Blogs } from '@/data/blog/blog.type'
import { getBlog, getBlogBySlug } from '@/helpers/getBlog'
import dateFormat, { dateStringToISO } from '@/libs/dateFormat'
import { getMetaDataBlog } from '@/libs/metaData'

import clsx from 'clsx'
import { LayoutProps } from 'framer-motion'
import { GetStaticPaths, GetStaticPathsResult, GetStaticProps, NextPage } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import dynamic from 'next/dynamic'
import 'prism-themes/themes/prism-night-owl.css'
import { ParsedUrlQuery } from 'querystring'
import { HiOutlineCalendar, HiOutlineClock, HiOutlineEye } from 'react-icons/hi'
import readingTime from 'reading-time'
import rehypeSlug from 'rehype-slug'

const BackToTop = dynamic(() => import('@/components/atoms/BackToTop'))

interface BlogPostProps {
  mdxSource: MDXRemoteSerializeResult
  header: Blogs & { views?: number }
}

interface slug extends ParsedUrlQuery {
  slug: string
}

const BlogPost: NextPage<BlogPostProps> = ({ header, mdxSource }) => {
  const metaData = getMetaDataBlog({
    ...header,
    slug: '/blog/' + header.slug
  })

  return (
    <Layout {...(metaData as LayoutProps)}>
      <BackToTop />
      <article className={clsx('flex flex-col', 'gap-8')}>
        <section className={clsx('pb-8 border-b', 'border-theme-300 dark:border-theme-700')}>
          <h1 className={clsx('max-w-prose', 'text-3xl md:text-5xl')}>{header.title}</h1>
          <p className='my-8'>{header.summary}</p>

          <div className={clsx('flex flex-col', 'gap-4', 'md:flex-row md:items-center md:justify-between')}>
            <div className={clsx('flex items-center', 'gap-4')}>
              <div className={clsx('flex items-center', 'gap-2', 'text-sm md:text-base')}>
                <HiOutlineClock />
                <p>{header.est_read}</p>
              </div>
              {header.views && (
                <div className='flex items-center gap-2 text-sm md:text-base'>
                  <HiOutlineEye />
                  <p>{header.views} Views</p>
                </div>
              )}
            </div>
            <div className={clsx('flex items-center', 'gap-2')}>
              <HiOutlineCalendar className={clsx('text-lg')} />
              <time className={clsx('text-sm md:text-base')} dateTime={dateStringToISO(header.published)}>
                {dateFormat(header.published)}
              </time>
            </div>
          </div>
        </section>

        <section className={clsx('flex flex-col', 'gap-4')}>
          <div className={clsx('flex flex-col', 'gap-4')}>
            <div className={clsx('flex items-center', 'gap-4')}>
              <CustomImage
                display='intrinsic'
                className={clsx('rounded-full')}
                src={header.author_image}
                width={32}
                height={32}
                alt={header.author_name}
              />
              <p>{header.author_name}</p>
            </div>
          </div>
        </section>

        {header.thumbnail && (
          <figure className={clsx('relative', 'w-full', 'h-56 md:h-96', 'mb-10')}>
            <ContentImage alt={header.title} src={header.thumbnail} title={header.title} />
          </figure>
        )}

        <section className={clsx('prose dark:prose-invert', 'md:prose-lg', 'prose-headings:scroll-mt-24')}>
          <MDXRemote {...mdxSource} components={MDXComponents} />
        </section>
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await getBlog()

  const paths = res.map((r) => ({ params: { slug: r.header.slug } })) as GetStaticPathsResult['paths']

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<BlogPostProps> = async (ctx) => {
  const mdxPrism = await require('mdx-prism')

  const { slug } = ctx.params as slug

  const res = await getBlogBySlug(slug)
  const est_read = readingTime(res.content).text

  const mdxSource = await serialize(res.content, {
    mdxOptions: { rehypePlugins: [mdxPrism, rehypeSlug] }
  })

  return {
    props: {
      header: { est_read, ...res.header },
      mdxSource
    }
  }
}

export default BlogPost