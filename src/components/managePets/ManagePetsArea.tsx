import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { IAnimal } from "../../common/interface/animal.interface";
import { environment } from "../../environment/environment";
import ManagePetsSidebar from "./ManagePetsSidebar";
import { useParams } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";
import AuthService from "../../common/Auth.service";

interface Props {
  history?: any;
  match?: any;
  location?: any;
}

const InitialState = {
  animals: [] as IAnimal[],
  isSearch: false,
};

type State = typeof InitialState;

class ManagePetsArea extends React.Component<Props, State> {
  isManager = AuthService.isManager();
  constructor(props) {
    super(props);
    this.state = { animals: [], isSearch: false };
    this.search = this.search.bind(this);
    this.getAnimals = this.getAnimals.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  componentDidMount() {
    const path = window.location.href.split("/").pop();
    console.log(path);
    if (path !== "manage") {
      this.search([], path);
      this.setState({ isSearch: true });
    } else {
      this.getAnimals();
    }
  }
  clearSearch() {
    this.getAnimals();
    this.setState({ isSearch: false });
  }

  async search(breeds?: string[], keyword?: string) {
    if (!breeds?.length && !keyword) {
      await this.getAnimals();
      return;
    }

    const requestOptions = {
      keyword: keyword,
      breed: breeds,
    };

    try {
      const response = await axios.post(
        environment.endpoint + "animal/search",
        requestOptions
      );

      const { animals, images } = response.data;
      if (animals && animals.length) {
        const animalImagesMap = new Map(
          images?.map((image) => [image.animal_id, image.image])
        );
        const updatedAnimals = animals.map((animal) => ({
          ...animal,
          image: animalImagesMap.get(animal.id) || "",
        }));
        this.setState({
          animals: images && images.length ? updatedAnimals : animals,
        });
        console.log(this.state.animals);
      } else {
        this.setState({ animals: animals });
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async getAnimals() {
    try {
      const response = await axios.get(
        environment.endpoint + "animal/list_with_details"
      );
      this.setState({ animals: response.data.data });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { animals } = this.state;
    return (
      <div className="shop-area pt-110 pb-110">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-8 order-2 order-lg-0">
              <ManagePetsSidebar search={this.search} />
            </div>
            <div className="col-lg-9">
              <div className="shop-wrap">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h4 className="title m-0 me-3">Shop</h4>
                  {this.isManager ? (
                    <Link to="/pet/add" className="btn">
                      Add New Pet <img src="img/icon/w_pawprint.png" alt="" />
                    </Link>
                  ) : (
                    ""
                  )}

                  {this.state.isSearch ? (
                    <a
                      className="btn"
                      onClick={() => {
                        this.clearSearch();
                      }}
                    >
                      Clear Search
                    </a>
                  ) : null}
                </div>

                <div className="row justify-content-center">
                  {animals.length
                    ? animals?.reverse().map((animal, index) => {
                        return this.getItemCard(animal, index);
                      })
                    : "Animals not found. Please try another keyword."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getItemCard(animal: IAnimal, index: number) {
    const image = animal?.image
      ? environment.basepath + "uploads/" + animal?.image
      : "/img/image-not-found.png";
    return (
      <div key={index} className="col-lg-4 col-sm-6">
        <div className="shop-item mb-55">
          <div className="shop-thumb">
            <Link to={"/pet-details/" + animal.id}>
              <img
                className="w-100"
                style={{ height: "267px", objectFit: "cover" }}
                src={image}
                alt=""
              />
            </Link>
          </div>
          <div className="shop-content">
            <span>{animal?.breed_name}</span>
            <h4 className="title">
              <Link to={"/pet-details/" + animal.id}>{animal?.name}</Link>
            </h4>
            <div className="shop-content-bottom">
              <span className="price">${animal.price}</span>
              <span className="add-cart">
                <Link
                  className="d-flex align-items-center"
                  to={"/pet/" + animal.id}
                >
                  Edit
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManagePetsArea;
