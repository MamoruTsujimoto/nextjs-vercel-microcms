import React from 'react'
import Head from 'next/head'
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage
} from 'next'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { Header } from '../../../components/header'
import { Nav } from '../../../components/nav'
import { Main } from '../../../components/main'
import { ListContentsResponse } from '../../../types/api'
import { BlogResponse } from '../../../types/blog'
import { SiteDataResponse } from '../../../types/siteData'
import { client } from '../../../utils/api'
import { toStringId } from '../../../utils/toStringId'

type StaticProps = {
  siteData: SiteDataResponse;
  blogList: ListContentsResponse<BlogResponse>
}
type PageProps = InferGetStaticPropsType<typeof getStaticProps>

const Page: NextPage<PageProps> = (props) => {
  const { siteData, blogList } = props
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>

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
        <h1>タグ一覧</h1>
        <ul>
          {blogList.contents.map((blog) => (
            <li key={blog.id}>
              <Link href={`/blogs/${blog.id}`}>
                <a>{blog.title}</a>
              </Link>
            </li>
          ))}
        </ul>
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
  const { params } = context

  if (!params?.id) {
    throw new Error('Error: ID not found')
  }

  const id = toStringId(params.id)

  try {
    const siteDataPromise = client.v1.sitedata.$get({
      query: { fields: "title" },
    });

    const blogListPromise = client.v1.blogs.$get({
      query: {
        fields: 'id,title',
        filters: `tags[contains]${id}`
      },
    });

    const [siteData, blogList] = await Promise.all([
      siteDataPromise,
      blogListPromise,
    ]);

    return {
      props: { siteData, blogList },
      revalidate: 60
    }
  } catch (e) {
    return { notFound: true }
  }
}

export default Page
