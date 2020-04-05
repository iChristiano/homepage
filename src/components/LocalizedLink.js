
import React from "react";
//import { Link } from "gatsby";
import { LocaleContext } from "./Layout"
import locales from "../../config/i18n";
import AniLink from "gatsby-plugin-transition-link/AniLink";

// Use the globally available context to choose the right path
const LocalizedLink = ({ to, ...props }) => {
  const { locale } = React.useContext(LocaleContext);

  const isIndex = to === `/`;

  // If it's the default language, don't do anything
  // If it's another language, add the "path"
  // However, if the homepage/index page is linked don't add the "to"
  // Because otherwise this would add a trailing slash
  const path = locales[locale].default ? to : `/${locales[locale].path}${isIndex ? `` : `${to}`}`;

  return (<AniLink swipe entryOffset={100} duration={0.5} top="exit" {...props} to={`${path}`}/>);
}

export default LocalizedLink;