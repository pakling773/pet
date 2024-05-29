import $ from "jquery";
import { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";

import authService from "../common/Auth.service";
import MiniCart from "./header/mini-cart";
import { useHistory } from "react-router-dom";
import { IAnimal } from "../common/interface/animal.interface";
import AuthService from "../common/Auth.service";

interface Props {
  favItems: IAnimal[];
  onRemoveFav: any;

  Afterlogout: any;
  loginState: boolean;
}

function Header(props: Props) {
  const path = window.location.href.split("/");
  const manage = path.includes("manage");

  const isManager = AuthService.isManager();
  const history = useHistory();
  var isLoggedIn = props.loginState;
  const handleActive = (e) => {
    document.querySelectorAll(".main-menu ul li").forEach((el) => {
      el.classList.remove("active");
    });
    e.target.parentNode.classList += " active";
  };

  useEffect(() => {
    const checkLogin = props.loginState;
    if ($(".mobile-menu").length) {
      var mobileMenuContent = $(".menu-area .main-menu").html();
      $(".mobile-menu .menu-box .menu-outer").html(mobileMenuContent);

      $(".mobile-nav-toggler").on("click", function () {
        $("body").addClass("mobile-menu-visible");
      });

      //Menu Toggle Btn
      $(".menu-backdrop, .mobile-menu .close-btn").on("click", function () {
        $("body").removeClass("mobile-menu-visible");
      });
    }

    $(".navbar-toggle").on("click", function () {
      $(".navbar-nav").addClass("mobile_menu");
    });
    $(".navbar-nav li a").on("click", function () {
      $(".navbar-collapse").removeClass("show");
    });

    $(".header-search > a").on("click", function () {
      $(".search-popup-wrap").slideDown();
      return false;
    });

    $(".search-close").on("click", function () {
      $(".search-popup-wrap").slideUp(500);
    });
  }, []);

  const logout = () => {
    localStorage.clear();
    props.Afterlogout();
    const path = "/login";

    history.push(path);
  };

  const SearchForm = () => {
    const input: any = document.getElementById("input");
    const keyword = input.value;
    history.push({ pathname: "/manage/" + keyword, state: "hello world" });
    $(".search-popup-wrap").slideUp(500);
    // console.log("saerch form here");

    // console.log(path);
    // history.push(path);
    // return false;
  };

  return (
    <header>
      <div className="header-top-area">
        <div className="container custom-container">
          <div className="row align-items-center">
            <div className="col-md-7">
              <div className="header-top-left">
                <ul>
                  <li>Call us: 747-800-9880</li>
                  <li>
                    <i className="far fa-clock" />
                    Opening Hours: 7:00 am - 9:00 pm (Mon - Sun)
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-5">
              <div className="header-top-right">
                <ul className="header-top-social">
                  <li className="follow">Follow :</li>
                  <li>
                    <a href="/#">
                      <i className="fab fa-facebook-f" />
                    </a>
                  </li>
                  <li>
                    <a href="/#">
                      <i className="fab fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="/#">
                      <i className="fab fa-instagram" />
                    </a>
                  </li>
                  <li>
                    <a href="/#">
                      <i className="fab fa-linkedin-in" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="sticky-header" className="menu-area">
        <div className="container custom-container">
          <div className="row">
            <div className="col-12">
              <div className="mobile-nav-toggler">
                <i className="fas fa-bars" />
              </div>
              <div className="menu-wrap">
                <nav className="menu-nav show">
                  <div className="logo">
                    <Link to="/">
                      <img src="img/logo/logo.png" alt="" />
                    </Link>
                  </div>
                  <div className="navbar-wrap main-menu d-none d-lg-flex">
                    <ul className="navigation">
                      <li className="">
                        <Link
                          to="/"
                          className="active"
                          onClick={(e) => handleActive(e)}
                        >
                          Home
                        </Link>
                      </li>

                      {isManager ? (
                        <li className="">
                          <Link to="/manage" onClick={(e) => handleActive(e)}>
                            Manage Pets
                          </Link>
                        </li>
                      ) : null}

                      {isManager ? (
                        <li className="">
                          <Link to="/request" onClick={(e) => handleActive(e)}>
                            Pet Requests
                          </Link>
                        </li>
                      ) : null}

                      <li className="menu-item-has-children">
                        <Link to="/blogs" onClick={(e) => handleActive(e)}>
                          Blog
                        </Link>
                      </li>
                      <li>
                        <Link to="/contacts" onClick={(e) => handleActive(e)}>
                          contacts
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="header-action d-none d-md-block">
                    <ul>
                      {/* <li className="header-search">
                        <a>
                          <i className="flaticon-search" />
                        </a>
                      </li> */}

                      <li className="header-shop-cart">
                        <a href="/#">
                          <img src="img/star.png" alt="" />
                          {/* <span>2</span> */}
                        </a>
                        <MiniCart
                          favItems={props.favItems}
                          onRemoveFav={props.onRemoveFav}
                        />
                      </li>
                      <li className="header-btn">
                        {isLoggedIn ? (
                          <a
                            className="btn"
                            onClick={() => {
                              logout();
                            }}
                          >
                            Logout
                            <img src="img/icon/w_pawprint.png" alt="" />
                          </a>
                        ) : (
                          <Link to="/login" className="btn">
                            Login <img src="img/icon/w_pawprint.png" alt="" />
                          </Link>
                        )}
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>

              <div className="mobile-menu">
                <nav className="menu-box">
                  <div className="close-btn">
                    <i className="fas fa-times" />
                  </div>
                  <div className="nav-logo">
                    <Link to="/">
                      <img src="img/logo/logo.png" alt="" title="true" />
                    </Link>
                  </div>
                  <div className="menu-outer"></div>
                </nav>
              </div>
              <div className="menu-backdrop" />
            </div>
          </div>
        </div>
        <div
          className="header-shape"
          style={{ backgroundImage: "url('img/bg/header_shape.png')" }}
        />
      </div>

      <div
        className="search-popup-wrap"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="search-close">
          <span>
            <i className="fas fa-times" />
          </span>
        </div>
        <div className="search-wrap text-center">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="title">... Search Here ...</h2>
                <div className="search-form">
                  <input
                    type="text"
                    name="keyword"
                    placeholder="Type keywords here"
                    id="input"
                  />
                  <button
                    type="button"
                    className="search-btn"
                    onClick={SearchForm}
                  >
                    <i className="fas fa-search" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
