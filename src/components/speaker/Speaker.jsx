import React from "react";
import "./Speaker.css";
import { Heart, Eye, Star, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { addLike, deleteLike } from "../../redux/likeSlice";
import { addToBasket } from "../../redux/basketSlice";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import Speakerimg1 from "../../assets/speaker.png";

const Speaker = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.like.value);
  const cartItems = useSelector((state) => state.basket.value);
  const [newsList, setNewsList] = useState([]);
  const [exploreItems, setExploreItems] = useState([]);

  useEffect(() => {
    api.get("/news/getNews").then(res => setNewsList(res.data)).catch(err => console.log(err));
    api.get("/products/getProducts").then(res => setExploreItems(res.data)).catch(err => console.log(err));
  }, []);

  const handleToggleLike = (item) => {
    const isExist = wishlistItems.some((liked) => liked.id === item.id);
    if (isExist) dispatch(deleteLike(item.id));
    else dispatch(addLike(item));
  };

  const handleAddToCart = (item) => {
    const isExist = cartItems.some((cartItem) => cartItem.id === item.id);
    if (!isExist) dispatch(addToBasket({ ...item, quantity: 1 }));
  };

  return (
    <main className="main-content">
      <section className="container speaker-wrap">
        <div className="speaker-left">
          <h4>{t("categories")}</h4>
          <h2>{t("enhance_music")}</h2>
          <div className="time-wrap">
            <div className="time">
              23<span>{t("hours")}</span>
            </div>
            <div className="time">
              05<span>{t("days")}</span>
            </div>
            <div className="time">
              59<span>{t("minutes")}</span>
            </div>
            <div className="time">
              35<span>{t("seconds")}</span>
            </div>
          </div>
          <button className="speaker-buy-btn">{t("buy_now")}</button>
        </div>
        <div className="speaker-right">
          <img src={Speakerimg1} alt="Speaker" />
        </div>
      </section>

      <section className="explore-section container">
        <div className="section-title">
          <span className="red-rectangle"></span>
          <h4 className="sub-title">{t("our_products")}</h4>
        </div>
        <div className="explore-header">
          <h2>{t("explore_products")}</h2>
        </div>
        <div className="explore-grid">
          {exploreItems.map((item) => {
            const isLiked = wishlistItems.some((liked) => liked.id === item.id);
            return (
              <div key={item.id} className="card">
                <div className="card-top">
                  {item.isNew && <span className="new-badge">NEW</span>}
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.image}
                      alt={item.description || "Mahsulot"}
                      className="product-image"
                    />
                  </Link>
                  <div className="card-icons">
                    <span
                      className="icon-bg"
                      onClick={() => handleToggleLike(item)}
                    >
                      <Heart
                        size={20}
                        fill={isLiked ? "#db4444" : "none"}
                        color={isLiked ? "#db4444" : "currentColor"}
                      />
                    </span>
                    <Link to={`/product/${item.id}`} className="icon-bg">
                      <Eye size={20} color="currentColor" />
                    </Link>
                  </div>
                  <button
                    className="add-to-cart-bar"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart size={18} /> {t("add_to_cart")}
                  </button>
                </div>
                <div className="card-bottom">
                  <h3>{item.description || "Mahsulot"}</h3>
                  <div className="price-row">
                    <span className="current-price">${item.price}</span>
                    <div className="rating-wrap">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < 4 ? "#FFAD33" : "none"}
                          color={i < 4 ? "#FFAD33" : "#D1D1D1"}
                        />
                      ))}
                      <span className="count">({item.ratingCount || 65})</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="view-all-footer">
          <button className="red-btn">{t("view_all")}</button>
        </div>
      </section>

      <section className="featured-section container">
        <div className="section-title">
          <span className="red-rectangle"></span>
          <h4 className="sub-title">{t("featured")}</h4>
        </div>
        <div className="explore-header">
          <h2>{t("new_arrival")}</h2>
        </div>
        <div className="new-arrival-grid" style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
          {newsList.map((news) => (
            <div key={news.id} className="grid-item" style={{position: 'relative', width: 'calc(50% - 10px)', height: '280px', borderRadius: '4px', overflow: 'hidden', background: '#000'}}>
              <img src={news.url} alt="News" style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8}} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Speaker;
