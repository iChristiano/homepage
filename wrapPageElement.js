// ! this is currently not used since the layout is used via transition link api
import React from "react";
import TemplateWrapper from "./src/components/Layout";

// Pass all props (hence the ...props) to the layout component so it has access to things like pageContext or location
const wrapPageElement = ({ element, props }) => (<TemplateWrapper {...props}>{element}</TemplateWrapper>);

export default wrapPageElement;