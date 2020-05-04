import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { LocaleContext } from "./Layout";
import { CMS_LOCALE } from '../../config/constants';

const useTranslations = () => {
    // grab the locale (passed through context) from the Context Provider, in cms context use a default locale
    const { locale } = React.useContext(LocaleContext) || CMS_LOCALE;

    // query the JSON files in <rootDir>config/translations
    const { rawData } = useStaticQuery(query);

    // simplify the response from GraphQL
    const simplified = rawData.edges.map(item => {
        return {
            name: item.node.name,
            translations: item.node.translations
        };
    });

    // only return translations for the current locale
    const { translations } = simplified.filter(lang => lang.name === locale)[0];

    return translations;
}

export default useTranslations;

const query = graphql`
  query useTranslations {
    rawData: allFile(filter: { sourceInstanceName: { eq: "translations" } }) {
      edges {
        node {
          name
          translations: childTranslationsJson {
            hello
            subline
            backToHome
            about
            products
          }
        }
      }
    }
  }
`