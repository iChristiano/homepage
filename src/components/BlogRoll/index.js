import React from 'react'
import PropTypes from 'prop-types'
import { graphql, StaticQuery } from 'gatsby'
import PreviewCompatibleImage from '../PreviewCompatibleImage'
import LocalizedLink from "../LocalizedLink"
import { LocaleContext } from "../Layout"

import blogRollStyle from './blogRoll.module.scss';

import { CMS_LOCALE } from '../../../config/constants';

const BlogRoll = ({ data }) => {
    // grab the locale (passed through context) from the Context Provider, in cms context use a default locale
    const { locale } = React.useContext(LocaleContext) || CMS_LOCALE;
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div className="columns is-multiline">
        {posts &&
          posts.filter(post => post.node.fields.locale === locale).map(({ node: post }) => (
            <div className="is-parent column is-6" key={post.id}>
              <article
                className={`
                    ${blogRollStyle.blogListItem} tile is-child box notification 
                    ${ post.frontmatter.featuredpost ? blogRollStyle.isFeatured : ''}
                `}
              >
                <header>
                  {post.frontmatter.featuredimage ? (
                    <div className={blogRollStyle.featuredThumbnail}>
                      <PreviewCompatibleImage
                        imageInfo={{
                          image: post.frontmatter.featuredimage,
                          alt: `featured image thumbnail for post ${post.frontmatter.title}`,
                        }}
                      />
                    </div>
                  ) : null}
                  <p className="post-meta">
                    <LocalizedLink
                      className="title has-text-primary is-size-4"
                      to={`/blog/${post.fields.slug}`}
                    >
                      {post.frontmatter.title}
                    </LocalizedLink>
                    <span> &bull; </span>
                    <span className="subtitle is-size-5 is-block">
                      {post.frontmatter.date}
                    </span>
                  </p>
                </header>
                <p>
                  {post.excerpt}
                  <br />
                  <br />
                  <LocalizedLink className="button" to={`/blog/${post.fields.slug}`}>
                    Keep Reading →
                  </LocalizedLink>
                </p>
              </article>
            </div>
          ))}
      </div>
    )
}

BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}, filter: {frontmatter: {templateKey: {eq: "blog-post"}}}) {
          edges {
            node {
              excerpt(pruneLength: 400)
              id
              fields {
                slug
                locale
              }
              frontmatter {
                title
                templateKey
                date(formatString: "MMMM DD, YYYY")
                featuredpost
                featuredimage {
                  childImageSharp {
                    fluid(maxWidth: 120, quality: 100) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogRoll data={data} count={count} />}
  />
)
