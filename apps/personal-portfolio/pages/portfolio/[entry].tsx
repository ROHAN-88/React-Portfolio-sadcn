import {
  Layout,
  PortfolioFooter,
  PortfolioHeader,
} from '@msanvarov/core-components';
import fs from 'fs';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import remarkGfm from 'remark-gfm';
import { CASE_STUDIES_PATH, caseStudiesFilePaths } from '../../utils/mdx.utils';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = caseStudiesFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((entry) => ({ params: { entry } }));

  return {
    paths,
    fallback: false,
  };
};
export const getStaticProps: GetStaticProps<PortfolioEntryPageProps> = async ({
  params,
}) => {
  const filePath = `${params?.entry}.mdx`;
  const postFilePath = path.join(CASE_STUDIES_PATH, filePath);

  // 🛑 Check if file exists first
  if (!fs.existsSync(postFilePath)) {
    console.warn(`⚠️ File not found: ${postFilePath}`);
    // If you want Next.js to show a 404 page for missing entries:
    return { notFound: true };
  }

  const fileContents = fs.readFileSync(postFilePath, 'utf8');
  const fileMetadata = fs.statSync(postFilePath);

  const { content, data } = matter(fileContents);

  const markdownContent = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [],
    },
    scope: data,
  });

  return {
    props: {
      content: markdownContent,
      frontMatter: {
        ...data,
        created: fileMetadata.ctime.toISOString(),
        modified: fileMetadata.mtime.toISOString(),
      },
    },
  };
};

type PortfolioEntryPageProps = {
  content: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  >;
  frontMatter: Record<string, string>;
};

// List of custom components
const components = {
  PortfolioHeader: PortfolioHeader,
  PortfolioFooter: PortfolioFooter,
};

const PortfolioEntryPage = ({
  content,
  frontMatter,
}: PortfolioEntryPageProps) => {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  return (
    <Layout
      title={`${frontMatter.title}`}
      head={
        <>
          <meta name="description" content={frontMatter.description} />
          <meta name="keywords" content={frontMatter.category} />
          <meta name="author" content={'Rohan Shrestha'} />
          <meta property="og:title" content={frontMatter.title} />
          <meta property="og:description" content={frontMatter.description} />
          <meta
            property="og:image"
            content={`${origin}${frontMatter.thumbnail}`}
          />
          <meta property="og:url" content={`${origin}${frontMatter.uid}`} />
          <meta name="twitter:title" content={frontMatter.title} />
          <meta name="twitter:description" content={frontMatter.description} />
          <meta
            name="twitter:image"
            content={`${origin}${frontMatter.thumbnail}`}
          />
          <meta name="twitter:card" content="summary_large_image" />
        </>
      }
    >
      <section className="project-details-wrap">
        <MDXRemote {...content} components={components} />
      </section>
    </Layout>
  );
};

export default PortfolioEntryPage;
