import React from "react";
import { LocaleContext } from "./Layout";
import locales from "../../config/i18n";
import AniLink from "gatsby-plugin-transition-link/AniLink";

// use the globally available context to choose the right path, in cms context link component is not needed
const LocalizedLink = ({ to, ...props }) => {
    let renderElement;
    const { locale } = React.useContext(LocaleContext) || { locale:'cmsContext' };
    
    if(locale === 'cmsContext'){
        renderElement = <div {...props} />;
    } else {
        const isIndex = to === `/`;

        // if it's the default language, don't do anything, if it's another language, add the "path"
        // however, if the homepage/index page is linked don't add the "to", because otherwise this would add a trailing slash
        const path = locales[locale].default ? to : `/${locales[locale].path}${isIndex ? `` : `${to}`}`;
        renderElement = <AniLink swipe entryOffset={100} duration={0.5} top="exit" {...props} to={`${path}`}/>;
    }
    return (renderElement);
}

export default LocalizedLink;