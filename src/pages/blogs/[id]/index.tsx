import React from 'react'
import Head from 'next/head'

import { Header } from '../../../components/header'
import { Nav } from '../../../components/nav'
import { Main } from '../../../components/main'

import {
  NextPage,
  GetStaticPaths,
  InferGetStaticPropsType,
  GetStaticProps
} from 'next'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'

import { BlogResponse } from '../../../types/blog'
import { SiteDataResponse } from '../../../types/siteData'
import { client } from '../../../utils/api'
import { toStringId } from '../../../utils/toStringId'

type StaticProps = {
  siteData: SiteDataResponse;
  blog: BlogResponse;
  draftKey?: string;
}
type PageProps = InferGetStaticPropsType<typeof getStaticProps>

const Page: NextPage<PageProps> = (props) => {
  const { siteData, blog, draftKey } = props
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      {draftKey && (
        <div>
          現在プレビューモードで閲覧中です。
          <Link href={`/api/exit-preview?id=${blog.id}`}>
            <a>プレビューを解除</a>
          </Link>
        </div>
      )}

      <Head>
        <title>{siteData.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Header
        title={siteData.title}
      />

      <Nav>
        <Link href="/">Home</Link>
      </Nav>

      <Main>
        <header>
          <h1 className="text-2xl mt-5 mb-5">{blog.title}</h1>
          <ul className="mb-10">
            <li>publishedAt: {blog.publishedAt}</li>
            {blog.tags && blog.tags.length > 0 && (
              <li>
                tag:
                <ul>
                  {blog.tags.map((tag) => (
                    <li key={tag.id}>
                      <Link href={`/tags/${tag.id}`}>{tag.name}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </header>
        {blog.body && (
          <article dangerouslySetInnerHTML={{ __html: blog.body }} />
        )}
      </Main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: 'blocking',
    paths: []
  }
}

export const getStaticProps: GetStaticProps<StaticProps> = async (context) => {
  const { params, previewData } = context

  if (!params?.id) {
    throw new Error('Error: ID not found')
  }

  const id = toStringId(params.id)
  const draftKey = previewData?.draftKey
    ? { draftKey: previewData.draftKey }
    : {}

  try {

    const siteDataPromise = client.v1.sitedata.$get({
      query: { fields: "title" },
    });

    const blogPromise = client.v1.blogs._id(id).$get({
      query: {
        fields: 'id,title,body,publishedAt,tags',
        ...draftKey
      },
    });

    const [siteData, blog] = await Promise.all([
      siteDataPromise,
      blogPromise,
    ]);

    return {
      props: { siteData, blog, ...draftKey },
      revalidate: 60
    }
  } catch(e) {
    return { notFound: true}
  }
}

export default Page
