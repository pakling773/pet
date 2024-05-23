import axios from "axios";
import { Component } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { IAnimal, IAnimalBreed } from "../../common/interface/animal.interface";
import { environment } from "../../environment/environment";
import AuthService from "../../common/Auth.service";

interface Props {
  breed: IAnimalBreed;
  key: number;
}

const InitialState = {
  animals: [] as IAnimal[],
  breed: {} as IAnimalBreed,
  key: 0,
};

type State = typeof InitialState;

class RelatedPets extends Component<Props, State> {
  isManager = AuthService.isManager();
  constructor(props) {
    super(props);
    this.state = { animals: [], breed: {}, key: 1 };
  }

  async componentDidMount(): Promise<void> {
    const breed = this.props.breed;
    if (breed) {
      this.setState({ breed: breed });

      await this.getSimilarAnimals(breed.id);
    }
  }

  async getSimilarAnimals(breed_id: number) {
    console.log("get similar ann", this.state.breed.id);
    try {
      if (breed_id) {
        const response = await axios.get(
          environment.endpoint + "animal/similar/" + breed_id
        );
        console.log("similar", response.data.animals);
        this.setState({ animals: response.data.animals });
      }
    } catch (error) {
      console.error(error);
    }
  }

  settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: false,
    arrows: false,
    autoplaySpeed: 3000,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          speed: 1000,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
          speed: 1000,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          speed: 1000,
        },
      },
    ],
  };

  render() {
    const { animals, breed } = this.state;
    return (
      <div className="related-products-wrap">
        <h2 className="title">Other Animals from same breed {breed?.name}</h2>
        <Slider className="row related-product-active" {...this.settings}>
          {animals?.length ? (
            animals?.map((animal, index) => {
              return (
                <div key={index} className="col-lg">
                  <div className="shop-item mb-55">
                    <div className="shop-thumb">
                      <Link to={`${animal.id}`}>
                        <img
                          src={
                            animal.image
                              ? environment.basepath + "uploads/" + animal.image
                              : "img/image-not-found.png"
                          }
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="shop-content">
                      <span>
                        {animal.breed_name} {animal?.id}
                      </span>
                      <h4 className="title">
                        <Link to={`pet-details/${animal.id}`}>
                          {animal?.name}
                        </Link>
                      </h4>
                      <div className="shop-content-bottom">
                        <span className="price">${animal?.price}</span>
                        {this.isManager ? (
                          <span className="add-cart">
                            <Link to={"/pet/" + animal.id}>Edit</Link>
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-container text-center">
              <p>Related Animals Not Found </p>
            </div>
          )}
        </Slider>
      </div>
    );
  }
}

export default RelatedPets;
