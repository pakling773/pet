import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { environment } from "../../environment/environment";
const MiniCart = (props) => {
  useEffect(() => {}, []);

  const removeFav = (animal_id) => {
    props.onRemoveFav(animal_id);
  };

  return (
    <ul className="minicart">
      {props.favItems.length !== 0 ? (
        props.favItems?.map((data, i) => (
          <li className="d-flex align-items-start" key={i}>
            <div className="cart-img">
              <Link to={"/pet-details/" + data.id}>
                {data?.image !== null ? (
                  <img
                    src={environment.basepath + "uploads/" + data.image}
                    alt=""
                  />
                ) : (
                  <img src="img/image-not-found.png" />
                )}
              </Link>
            </div>
            <div className="cart-content">
              <h4>
                <Link to={"/pet-details/" + data.id}>
                  {data?.name} {data?.id}-{" "}
                </Link>
              </h4>
              <div className="cart-price">
                {data?.price == 0 ? (
                  <span className="new">Free</span>
                ) : (
                  <span className="new">${data?.price}</span>
                )}
              </div>
            </div>
            <div className="del-icon">
              <a
                onClick={() => {
                  removeFav(data?.id);
                }}
              >
                <i className="far fa-trash-alt" />
              </a>
            </div>
          </li>
        ))
      ) : (
        <li>Favourites Pets Will Show Here</li>
      )}
    </ul>
  );
};

export default MiniCart;
