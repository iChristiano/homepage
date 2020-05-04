import CMS from 'netlify-cms-app';

import BlogPostPreview from './preview-templates/BlogPostPreview';
import IndexPagePreview from './preview-templates/IndexPagePreview';
import AboutPagePreview from './preview-templates/AboutPagePreview';
import ProductPagePreview from './preview-templates/ProductPagePreview';

CMS.registerPreviewTemplate('blog-de', BlogPostPreview);
CMS.registerPreviewTemplate('blog-en', BlogPostPreview);
CMS.registerPreviewTemplate('pages', IndexPagePreview);
CMS.registerPreviewTemplate('pages-about', AboutPagePreview);
CMS.registerPreviewTemplate('pages-products', ProductPagePreview);
