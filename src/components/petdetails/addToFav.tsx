import { find } from "lodash";
import React from "react";
import { IAnimal } from "../../common/interface/animal.interface";
interface Props {
  animal: IAnimal;
}

const InitialState = {};

type State = typeof InitialState;
class AddToFavComponent extends React.Component<Props, State> {
  exists = false;
  favList = [];
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  render() {
    return (
      <a className="wishlist-btn  " onClick={this.addToFavourites.bind(this)}>
        <i className="fas fa-heart" />
        Add To Faviroute
      </a>
    );
  }

  addToFavourites() {}
}

export default AddToFavComponent;
