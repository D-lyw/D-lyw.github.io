import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import Calendar from "../assert/calendar.svg"
import Label from "../assert/label.svg"
import styles from "../styles/index.module.less"
const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="首页" />
      {/* <Bio /> */}
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        return (
          <article key={node.fields.slug}>
            <h2 className={styles.articleTitle}>
              <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                {title}
              </Link>
            </h2>
            <section className={styles.shortIntro}>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </section>
            <div className={styles.articleMate}>
              <span className={styles.date}>
                <Calendar />
                {node.frontmatter.date}
              </span>
              <span>
                {node.frontmatter.tags ? <Label /> : null}
                {node.frontmatter.tags
                  ? node.frontmatter.tags.split("/").join(" / ")
                  : null}
              </span>
            </div>
          </article>
        )
      })}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY.MM.DD")
            title
            description
            tags
          }
        }
      }
    }
  }
`
