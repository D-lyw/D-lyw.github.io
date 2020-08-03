import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import { Disqus } from "gatsby-plugin-disqus"
import styles from "../styles/blogPost.module.less"
import Calendar from "../assert/calendar.svg"
import Tags from "../assert/label.svg"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext

  const disqusConfig = {
    title: post.frontmatter.title,
    id: post.id,
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article style={{ padding: "0 5%" }}>
        <header>
          <h1
            style={{
              marginTop: rhythm(1),
              marginBottom: 0,
            }}
          >
            {post.frontmatter.title}
          </h1>
          <p
            style={{
              ...scale(-1 / 5),
              display: `block`,
              marginBottom: rhythm(1),
              color: "#999",
              marginTop: "1em",
            }}
          >
            <span>
              <Calendar
                style={{
                  width: "1.2em",
                  height: "1.2em",
                  verticalAlign: "middle",
                }}
              />
              &nbsp;
              {post.frontmatter.date}
            </span>
          </p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Disqus config={disqusConfig} />
      </article>

      <nav>
        <ul className={styles.pageChanger}>
          {previous && (
            <li className={styles.beforePage}>
              <Link to={previous.fields.slug} rel="prev">
                {/* ←  */}
                {previous.frontmatter.title}
              </Link>
            </li>
          )}
          {next && (
            <li className={styles.afterPage}>
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title}
                {/* → */}
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        description
      }
    }
  }
`
