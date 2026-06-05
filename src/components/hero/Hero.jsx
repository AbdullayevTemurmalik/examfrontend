import "./Hero.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { ChevronRight, ArrowRight, Apple } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useDispatch } from "react-redux";
import { name as setCategoryFilter } from "../../redux/filterSlice";

const Hero = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [swipers, setSwipers] = useState([]);

  useEffect(() => {
    api.get("/categories/getCategories").then(res => setCategories(res.data)).catch(err => console.log(err));
    api.get("/swiper/getSwipers").then(res => setSwipers(res.data)).catch(err => console.log(err));
  }, []);

  return (
    <section className="container hero-wrap">
      <aside className="products-category-menu">
        <nav>
          <ul className="category-menu-list">
            <li key="all">
              <a href="#" onClick={(e) => { e.preventDefault(); dispatch(setCategoryFilter("")); }}>
                Barcha mahsulotlar
                <ChevronRight size={16} />
              </a>
            </li>
            {categories.map((item) => (
              <li key={item.id}>
                <a href="#" onClick={(e) => { e.preventDefault(); dispatch(setCategoryFilter(item.id.toString())); }}>
                  {item.name}
                  <ChevronRight size={16} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="swiper-wrapper-open-menu">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
        >
          {swipers.map((s) => (
            <SwiperSlide key={s.id}>
              <div className="slide-inner" style={{width: "100%", height: "100%"}}>
                <img src={s.url} alt="Banner" style={{width: "100%", height: "100%", objectFit: "cover"}} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Hero;
