import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { environment } from "../environment/environment";
import Loading from "./loading";

// require ""

interface Props {}

const InitialState = {
  animals: [],
};

type State = typeof InitialState;

class PetsShop extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { animals: [] };
  }
  componentDidMount() {
    // const url = environment.endpoint + "animal/list_with_details";
    // const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMzUxNDcxMiwiZXhwIjoxNzE0NTUxNTEyfQ.56whnCyAQC02qSwatp1T-OTXXTh54Gp1VIvu_E8f84s' };
    // fetch(url,{ headers })
    //   .then((response) => response.json())
    //   .then((json) => {
    //    console.log(json.data);
    //     this.setState({ animals: json.data });

    //   });
    axios
      .get(environment.endpoint + "animal/list_with_details")
      .then((response) => this.setState({ animals: response.data.data }))
      .catch((error) => console.log(error));
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    return (
      <section className="adoption-shop-area">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-9">
              <div className="section-title text-center mb-65">
                <div className="section-icon">
                  <img src="img/icon/pawprint.png" alt="" />
                </div>
                <h5 className="sub-title">Meet the animals</h5>
                <h2 className="title">Puppies Waiting for Adoption</h2>
                <p>
                  The best overall dog DNA test is Embark Breed &amp; Health Kit
                  (view at Chewy), which provides you with a breed brwn and
                  information Most dogs
                </p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            {this.state.animals.length === 0 ? (
              <div className="col-md-12" style={{ textAlign: "center" }}>
                <Loading />
              </div>
            ) : (
              this.state.animals.map((animal) => this.getItem(animal))
            )}
          </div>
        </div>
      </section>
    );
  }

  getItem(animal) {
    var image = "";
    var img_src = <img src="img/image-not-found.png" />;
    if (animal.image !== null) {
      image = environment.basepath + "uploads/" + animal.image;
      img_src = <img src={image} />;
    }

    return (
      <div className="col-lg-4 col-md-6" key={animal.id}>
        <div className="adoption-shop-item">
          <div className="adoption-shop-thumb">
            {img_src}
            <Link to={"/pet-details/" + animal.id} className="btn">
              Adoption <img src="img/icon/w_pawprint.png" alt="" />
            </Link>
          </div>
          <div className="adoption-shop-content">
            <h4 className="title">
              <Link to={"/pet-details/" + animal.id}>
                {animal.name} {animal.id}{" "}
              </Link>
            </h4>
            <div className="adoption-meta">
              <ul>
                <li>
                  <i className="fas fa-cog" />
                  <a href="/#">{animal.breed_name}</a>
                </li>
                <li>
                  <i className="far fa-calendar-alt" /> Age : {animal.age}
                </li>
              </ul>
            </div>
            <div className="adoption-rating">
              <ul>
                <li className="rating">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                </li>
                <li className="price">
                  Gender :{" "}
                  <span>{this.capitalizeFirstLetter(animal.gender)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// function AdoptionShop() {

// }

export default PetsShop;
