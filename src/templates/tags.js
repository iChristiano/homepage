import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import LocalizedLink from "../components/LocalizedLink"

class TagRoute extends React.Component {
  render() {
    const posts = this.props.data.allMarkdownRemark.edges
    const postLinks = posts.map(post => (
      <li key={post.node.fields.slug}>
        <LocalizedLink to={`/blog/${post.node.fields.slug}`}>
          <h2 className="is-size-2">{post.node.frontmatter.title}</h2>
        </LocalizedLink>
      </li>
    ))
    const tag = this.props.pageContext.tag
    const title = this.props.data.site.siteMetadata.title
    const totalCount = this.props.data.allMarkdownRemark.totalCount
    const tagHeader = `${totalCount} post${
      totalCount === 1 ? '' : 's'
    } tagged with “${tag}”`

    return (
        <section className="section">
          <Helmet title={`${tag} | ${title}`} />
          <div className="container content">
            <div className="columns">
              <div
                className="column is-10 is-offset-1"
                style={{ marginBottom: '6rem' }}
              >
                <h3 className="title is-size-4 is-bold-light">{tagHeader}</h3>
                <ul className="taglist">{postLinks}</ul>
                <p>
                  <LocalizedLink to="/blog/tags">Browse all tags</LocalizedLink>
                </p>
              </div>
            </div>
          </div>
        </section>
    )
  }
}

export default TagRoute


export const tagPageQuery = graphql`
query TagPage($tag: String, $locale: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 1000, sort: {fields: [frontmatter___date], order: DESC}, filter: {frontmatter: {tags: {in: [$tag]}}, fields: {locale: {eq: $locale}}}) {
      totalCount
      edges {
        node {
          fields {
            slug
            locale
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
