import { Link } from "react-router-dom";

function Find() {
  return (
    <div className="find-area">
      <div className="container custom-container">
        <div className="row">
          <div className="col-12">
            <form>
              <div className="find-wrap">
                <div
                  className="location"
                  style={{ fontWeight: "bold", fontSize: 18 }}
                >
                  Latest Adoptoins
                </div>
                <div className="find-category">
                  <ul>
                    <li>
                      <Link to="/view-all">
                        <i className="flaticon-dog" /> Find Your Dog
                      </Link>
                    </li>
                    <li>
                      <Link to="/view-all">
                        <i className="flaticon-happy" /> Find Your Cat
                      </Link>
                    </li>
                    <li>
                      <Link to="/view-all">
                        <i className="flaticon-dove" /> Find Your Birds
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="other-find">
                  <Link
                    to="/view-all"
                    type="button"
                    style={{ color: "white", fontWeight: "bold" }}
                  >
                    Find All Dogs
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Find;
