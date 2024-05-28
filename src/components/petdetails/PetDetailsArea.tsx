import axios from "axios";
import React from "react";

import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { IAnimal, IAnimalBreed } from "../../common/interface/animal.interface";
import { environment } from "../../environment/environment";
import AddToFavComponent from "./addToFav";
import RelatedPets from "./relatedPets";
import { find } from "lodash";
import $ from "jquery";
import PetRequestModal from "./PetRequestModel";

// interface AnimalImage {
//   id: number;
//   image: String;
//   animal_id: number;
// }

interface Props {
  match: any;
  OnAddToFav: any;
  favItems: any;
}

const animal: IAnimal = {};
const breed: IAnimalBreed = {};

const InitialState = {
  animal: animal,
  breed: breed,
  animalImages: [],
  selectedImage: "",
  id: "",
  error: "",
  msg: "",
  check: false,
  key: 1,
};

type State = typeof InitialState;

class PetDetailsArea extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      animal: {},
      breed: {},
      animalImages: [],
      selectedImage: "",
      id: "",
      error: "",
      msg: "",
      check: false,
      key: 2,
    };
  }

  componentDidMount(): void {
    const id = this.props?.match.params.id;
    this.getAnimalById(id);
  }

  async getAnimalById(id): Promise<void> {
    const data: any = {
      animal: {},
      breed: {},
      animalImages: [],
    };
    try {
      const animal_http = await axios.get(
        environment.endpoint + "animal/get/" + id
      );
      const result = animal_http.data.data[0];
      data.animal = result;
      //

      const breed_http = await axios.get(
        environment.endpoint + "breed/get/" + result.breed_id
      );
      const breed = breed_http.data.data[0];
      data.breed = breed;
      console.log(data.breed);

      //
      const photos_http = await axios.get(
        environment.endpoint + "animal/photos/" + result.id
      );
      const images = photos_http.data.images;
      data.animalImages = images;

      //
    } catch (error) {
      console.log("error-----", error);
    }
    var check = find(this.props.favItems, (items) => {
      return items.id === data.animal.id;
    });

    if (check) {
      check = true;
    } else {
      check = false;
    }
    var new_key = this.state.key + 1;
    this.setState({
      animal: data.animal,
      breed: data.breed,
      animalImages: data.animalImages,
      id: id,
      check: check,
      key: new_key,
    });
  }

  addToFavourites(): void {
    this.props.OnAddToFav(this.state.animal);
    this.setState({ check: true });
  }

  onChangeAnimalImage(image: string): void {
    // setAnimalImage(image);
    this.setState({ selectedImage: image });
  }

  render() {
    return (
      <div>
        <section className="shop-details-area pt-110 pb-50">
          <div className="container">
            <div className="shop-details-wrap">
              <div className="row">
                <div className="col-7">
                  <div className="shop-details-img-wrap">
                    <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane show active"
                        id="item-one"
                        role="tabpanel"
                        aria-labelledby="item-one-tab"
                      >
                        <div className="shop-details-img">
                          {
                            <img
                              className="main-image"
                              src={
                                this.state.animalImages[0]?.image
                                  ? this.state.selectedImage !== ""
                                    ? this.state.selectedImage
                                    : environment.basepath +
                                      "uploads/" +
                                      this.state.animalImages[0]?.image
                                  : "/img/image-not-found.png"
                              }
                              alt=""
                            />
                          }
                        </div>
                      </div>
                      <div
                        className="tab-pane"
                        id="item-two"
                        role="tabpanel"
                        aria-labelledby="item-two-tab"
                      >
                        <div className="shop-details-img">
                          <img src="img/product/shop_details02.jpg" alt="" />
                        </div>
                      </div>
                      <div
                        className="tab-pane"
                        id="item-three"
                        role="tabpanel"
                        aria-labelledby="item-three-tab"
                      >
                        <div className="shop-details-img">
                          <img src="img/product/shop_details03.jpg" alt="" />
                        </div>
                      </div>
                      <div
                        className="tab-pane"
                        id="item-four"
                        role="tabpanel"
                        aria-labelledby="item-four-tab"
                      >
                        <div className="shop-details-img">
                          <img src="img/product/shop_details04.jpg" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="shop-details-nav-wrap">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                      {this.state.animalImages?.length > 1 &&
                        this.state.animalImages?.map((animalImage, index) => {
                          return (
                            <li
                              className="nav-item"
                              role="presentation"
                              key={index}
                            >
                              <a
                                className="nav-link active h-100"
                                id="item-one-tab"
                                data-toggle="tab"
                                href="/#item-one"
                                role="tab"
                                aria-controls="item-one"
                                aria-selected="true"
                                onClick={() =>
                                  this.onChangeAnimalImage(
                                    environment.basepath +
                                      "uploads/" +
                                      animalImage?.image
                                  )
                                }
                              >
                                <img
                                  className="h-100"
                                  src={
                                    environment.basepath +
                                    "uploads/" +
                                    animalImage?.image
                                  }
                                  alt=""
                                />
                              </a>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
                <div className="col-5">
                  <div className="shop-details-content">
                    <span>{this.state.breed?.name}</span>
                    <h2 className="title">{this.state.animal?.name}</h2>

                    <div className="shop-details-price">
                      Adoption Fee:&nbsp;
                      {this.state.animal?.price !== 0 ||
                      this.state.animal?.price ? (
                        <h5 className="price"> ${this.state.animal?.price}</h5>
                      ) : (
                        <h5 className="price"> Free</h5>
                      )}
                    </div>
                    <p>{this.state.animal?.short_description}</p>

                    <div className="shop-details-color">
                      <span>Color : {this.state.animal?.color}</span>
                    </div>
                    <div className="shop-details-quantity">
                      {!this.state.check ? (
                        <a
                          className="wishlist-btn"
                          onClick={this.addToFavourites.bind(this)}
                        >
                          <i className="fas fa-heart" /> Add to Favourites
                        </a>
                      ) : (
                        <h5>Added To Favourites</h5>
                      )}
                    </div>
                    <div className="shop-details-quantity">
                      <a
                        className="wishlist-btn btn"
                        style={{ color: "white" }}
                        data-toggle="modal"
                        data-target="#requestModal"
                      >
                        <i className="fas fa-heart" /> Request For Adoption
                      </a>
                    </div>
                    <div className="shop-details-bottom">
                      <ul>
                        <li className="sd-category">
                          <span className="title">Breed :</span>
                          {this.state.breed?.name}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="product-desc-wrap">
                  <ul className="nav nav-tabs" id="myTabTwo" role="tablist">
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        id="details-tab"
                        data-toggle="tab"
                        href="/#details"
                        role="tab"
                        aria-controls="details"
                        aria-selected="true"
                      >
                        Details More
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content" id="myTabContentTwo">
                    <div
                      className="tab-pane fade show active"
                      id="details"
                      role="tabpanel"
                      aria-labelledby="details-tab"
                    >
                      <div className="product-desc-content">
                        <p>{this.state.animal?.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <RelatedPets breed={this.state.breed} key={this.state.key} />
          </div>
          <PetRequestModal animal_id={this.state.id} />
        </section>
      </div>
    );
  }
}

export default withRouter(PetDetailsArea);
