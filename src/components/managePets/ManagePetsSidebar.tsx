import axios from "axios";
import { findIndex } from "lodash";
import { Component } from "react";
import { Link } from "react-router-dom";
import { environment } from "../../environment/environment";

interface Props {
  search?: any;
}

const InitialState = {
  breeds: [],
  selected: [],
  keyword: "",
};

type State = typeof InitialState;

class ManagePetsSidebar extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      breeds: [],
      selected: [],
      keyword: "",
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.getBreeds();
  }

  getBreeds() {
    axios
      .get(environment.endpoint + "breed/list")
      .then((response) => {
        const list = response.data.data;
        this.setState({ breeds: list });
      })
      .catch((error) => console.log(error));
  }

  onBreedChange(e) {
    const current = this.state.selected;
    if (e.currentTarget.checked) {
      current.push(e.target.value);
    } else {
      const key = findIndex(current, (x) => x === e.target.value);
      current.splice(key, 1);
    }
    this.setState({ selected: current });
  }

  onKeywordChange(e) {
    this.setState({ keyword: e.target.value });
  }

  handleSearch() {
    this.props.search(this.state.selected, this.state.keyword);
  }
  render() {
    const { breeds } = this.state;

    return (
      <aside className="shop-sidebar">
        <div className="widget">
          <div className="sidebar-search">
            <form>
              <input
                type="text"
                placeholder="Search ..."
                onChange={(e) => this.onKeywordChange(e)}
              />
              <button type="button" onClick={this.handleSearch}>
                <i className="fa fa-search" />
              </button>
            </form>
          </div>
        </div>

        <div className="widget">
          <h4 className="sidebar-title">Top Breeds</h4>
          <div className="shop-brand-list">
            <ul>
              {breeds.map((data) => (
                <li key={data.id}>
                  {" "}
                  <input
                    type="checkbox"
                    className="breedCheckbox"
                    name="breed_id[]"
                    onChange={(e) => this.onBreedChange(e)}
                    value={data.id}
                  />{" "}
                  {data.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="widget shop-widget-banner">
          <Link to="/shop">
            <img src="img/product/shop_add.jpg" alt="" />
          </Link>
        </div>
      </aside>
    );
  }
}

export default ManagePetsSidebar;
