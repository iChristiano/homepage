import React from 'react';
import { Link } from 'gatsby';
import github from '../img/github-icon.svg';
import logo from '../img/logo.svg';

import LocalizedLink from "./LocalizedLink"
import useTranslations from "./useTranslations"

const Navbar = () => {
  

  // toggleHamburger = () => {
  //   // toggle the active boolean in the state
  //   this.setState(
  //     {
  //       active: !this.state.active,
  //     },
  //     // after state has been updated,
  //     () => {
  //       // set the class in state for the navbar accordingly
  //       this.state.active
  //         ? this.setState({
  //             navBarActiveClass: 'is-active',
  //           })
  //         : this.setState({
  //             navBarActiveClass: '',
  //           })
  //     }
  //   )
  // }

  //render() {
    const { about, products } = useTranslations();
    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation"
      >
        <div className="container">
            <div className="navbar-start has-text-centered">
                <LocalizedLink to="/" className="navbar-item" title="Logo">
                <img src={logo} alt="Kaldi" style={{ width: '88px' }} />
                </LocalizedLink>
                <LocalizedLink className="navbar-item" to={`/${about}`}>
                    {`/${about}`}
                </LocalizedLink>
                <LocalizedLink className="navbar-item" to={`/${products}`}>
                    Products
                </LocalizedLink>
                <LocalizedLink className="navbar-item" to="/blog">
                    Blog
                </LocalizedLink>
                <LocalizedLink className="navbar-item" to="/contact">
                    Contact
                </LocalizedLink>
                <LocalizedLink className="navbar-item" to="/contact/examples">
                    Form Examples
                </LocalizedLink>
            </div>
            <div className="navbar-end has-text-centered">
              <a
                className="navbar-item"
                href="https://github.com/netlify-templates/gatsby-starter-netlify-cms"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="icon">
                  <img src={github} alt="Github" />
                </span>
              </a>
            </div>
            <div className="navbar-item">
              <Link to="/" hrefLang="de">
                Deutsch
              </Link>
              {`  `}/{`  `}
              <Link to="/en" hrefLang="en">
                English
              </Link>
            </div>
       
        </div>
      </nav>
    );
  //}
}

export default Navbar;
