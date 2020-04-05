const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

const locales = require(`./config/i18n`);
const {
  localizedSlug,
  findKey,
  removeLeadingSlash,
  removeTrailingSlash,
  removeIndex
} = require(`./src/utils/gatsby-node-helpers`);


exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  // First delete the incoming page that was automatically created by Gatsby
  // So everything in src/pages/
  deletePage(page);

  // Grab the keys ('de' & 'en') of locales and map over them
  Object.keys(locales).map(lang => {
    // Use the values defined in "locales" to construct the path
    const localizedPath = locales[lang].default ? page.path : `${locales[lang].path}${page.path}`;

    return createPage({
      // Pass on everything from the original page
      ...page,
      // Since page.path returns with a trailing slash (e.g. "/en/") we want to remove that (e.g. "en/")
      path: removeTrailingSlash(localizedPath),
      // Pass in the locale as context to every page
      // This context also gets passed to the src/components/layout file
      // This should ensure that the locale is available on every page
      context: {
        ...page.context,
        locale: lang,
        dateFormat: locales[lang].dateFormat,
      },
    });
  });
};


// // As you don't want to manually add the correct languge to the frontmatter of each file
// // a new node is created automatically with the filename
// // It's necessary to do that -- otherwise you couldn't filter by language
// exports.onCreateNode = ({ node, actions }) => {
//   const { createNodeField } = actions

//   // Check for "Mdx" type so that other files (e.g. images) are exluded
//   if (node.internal.type === `Mdx`) {
//     // Use path.basename
//     // https://nodejs.org/api/path.html#path_path_basename_path_ext
//     const name = path.basename(node.fileAbsolutePath, `.mdx`)

//     // Check if post.name is "index" -- because that's the file for default language
//     // (In this case "en")
//     const isDefault = name === `index`

//     // Find the key that has "default: true" set (in this case it returns "en")
//     const defaultKey = findKey(locales, o => o.default === true)

//     // Files are defined with "name-with-dashes.lang.mdx"
//     // name returns "name-with-dashes.lang"
//     // So grab the lang from that string
//     // If it's the default language, pass the locale for that
//     const lang = isDefault ? defaultKey : name.split(`.`)[1]

//     createNodeField({ node, name: `locale`, value: lang })
//     createNodeField({ node, name: `isDefault`, value: isDefault })
//   }
// }

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // convert image paths for gatsby images
  fmImagesToRelative(node)

  // Check for "MarkdownRemark" type so that other files (e.g. images) are exluded
  if (node.internal.type === `MarkdownRemark`) {
    // let value = createFilePath({ node, getNode })
    // value = removeTrailingSlash(value.split(`.`)[0]);
    // value = value.replace(/index/, ``)
    // createNodeField({
    //   name: `slug`,
    //   node,
    //   value,
    // })

    // Use path.basename
    // https://nodejs.org/api/path.html#path_path_basename_path_ext
    // It will return the file name without '.md' string (e.g. "file-name" or "file-name.lang")
    const name = path.basename(node.fileAbsolutePath, `.md`);

    // Check if post.name is "index" -- because that's the file for default language
    // (In this case "de")
    //let isDefault = name === `index`

    // Find the key that has "default: true" set (in this case it returns "en")
    const defaultKey = findKey(locales, o => o.default === true);

    // Check if file.name.lang has the default lang type.
    // (in this case the default language is for files set with "en")
    //const isDefault = name === `index` || name.split(`.`)[1] === defaultKey;
    const currentLangKey = name.split(`.`)[1];
    const isDefault = currentLangKey === defaultKey;

    // Files are defined with "name-with-dashes.lang.mdx"
    // name returns "name-with-dashes.lang"
    // So grab the lang from that string
    // If it's the default language, pass the locale for that
    const lang = isDefault ? defaultKey : currentLangKey;

    // Get the entire file name and remove the lang of it
    let slug = node.frontmatter.path || name.split(`.`)[0];
    slug = removeLeadingSlash(slug);
    slug = removeTrailingSlash(slug);
    slug = removeIndex(slug);

    createNodeField({ node, name: `slug`, value: slug });
    createNodeField({ node, name: `locale`, value: lang })
    createNodeField({ node, name: `isDefault`, value: isDefault })
  }
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              locale
              isDefault
              slug
            }
            frontmatter {
              tags
              templateKey
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach(edge => {
      const id = edge.node.id;
      const isDefault = edge.node.fields.isDefault;
      const locale = edge.node.fields.locale;
      const slug = edge.node.fields.slug;
      const isPage = true;
      const localizedPath = localizedSlug({ isDefault, locale, slug, isPage })
      createPage({
        path: localizedPath,
        tags: edge.node.frontmatter.tags,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
          locale
        },
      })
    })

    // Tag pages:
    let localizedTags = [];
    //let tags = []
    // Iterate through each post, putting all found tags into `tags`
    posts.forEach(edge => {
      if (_.get(edge, `node.frontmatter.tags`)) {
        const locale = edge.node.fields.locale;
        const postTags = edge.node.frontmatter.tags;
        const isDefault = edge.node.fields.isDefault;

        let currentLocalizedTags = postTags.map( (tag) => {
          return {
            id: `${locale}${tag}`,
            tag: tag,
            locale: locale,
            isDefault: isDefault
          };
        });
        localizedTags = localizedTags.concat(currentLocalizedTags);
      }
    })
    // Eliminate duplicate tags
    //tags = _.uniq(tags)
    localizedTags = localizedTags.filter((item, index, array) => {
      return array.map((mapItem) => mapItem['id']).indexOf(item['id']) === index;
    })

    // Make tag pages
    localizedTags.forEach(locTag => {
      const slug = `tags/${_.kebabCase(locTag.tag)}`;
      const tag = locTag.tag;
      const locale = locTag.locale;
      const isDefault = locTag.isDefault;
      const isPage = true;
      const localizedPath = localizedSlug({ isDefault, locale, slug, isPage });

      createPage({
        path: localizedPath,
        component: path.resolve(`src/templates/tags.js`),
        context: {
          tag,
          locale
        },
      })
    })
  })
}
