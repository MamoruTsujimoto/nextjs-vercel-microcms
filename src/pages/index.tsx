// src/pages/index.tsx
import React from 'react'
import Head from 'next/head'
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'

import { BlogListResponse } from '../types/blog'
import { SiteDataResponse } from '../types/siteData'
import { client } from '../utils/api'

import { Header } from '../components/header'
import { Main } from '../components/main'

import styles from '../styles/Home.module.css'

type StaticProps = {
  siteData: SiteDataResponse;
  blogList: BlogListResponse;
}

type PageProps = InferGetStaticPropsType<typeof getStaticProps>

const Page: NextPage<PageProps> = (props) => {
  const { siteData, blogList } = props;

  return (
    <>
      <Head>
        <title>{siteData.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Header
        title={siteData.title}
      />

      <Main>
        <section>
          <h2 className="text-xl mb-8">ブログ一覧</h2>
          <ul className="list-disc ml-11">
            {blogList.contents.map((blog) => (
              <li key={blog.id} className="mb-5">
                <Link href={`/blogs/${blog.id}`}>
                  <a>{blog.title}</a>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Main>
    </>
  );
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const siteDataPromise = client.v1.sitedata.$get({
    query: { fields: "title" },
  });

  const blogListPromise = client.v1.blogs.$get({
    query: { fields: "id,title" },
  });

  const [siteData, blogList] = await Promise.all([
    siteDataPromise,
    blogListPromise,
  ]);

  return {
    props: { siteData, blogList },
    revalidate: 60,
  };
};

export default Page;
