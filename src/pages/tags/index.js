import React from 'react'
import { kebabCase } from 'lodash'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/Layout'
import LocalizedLink from "../../components/LocalizedLink"

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
}) => (
  <div>
    <section className="section">
      <Helmet title={`Tags | ${title}`} />
      <div className="container content">
        <div className="columns">
          <div
            className="column is-10 is-offset-1"
            style={{ marginBottom: '6rem' }}
          >
            <h1 className="title is-size-2 is-bold-light">Tags</h1>
            <ul className="taglist">
              {group.map(tag => (
                <li key={tag.fieldValue}>
                  <LocalizedLink to={`/tags/${kebabCase(tag.fieldValue)}`}>
                    {tag.fieldValue} ({tag.totalCount})
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
)

export default TagsPage

export const tagPageQuery = graphql`
query TagsQuery($locale: String) {
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(limit: 1000, filter: {fields: {locale: {eq: $locale}}}) {
    group(field: frontmatter___tags) {
      fieldValue
      totalCount
      nodes {
        fields {
          locale
        }
      }
    }
  }
}
`
