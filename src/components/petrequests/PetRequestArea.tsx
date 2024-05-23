import { useEffect, useState } from "react";
import axios from "axios";
import { environment } from "../../environment/environment";

export default function PetRequestArea() {
  const [data, setData] = useState([]);
  var count = [1];

  useEffect(() => {
    axios
      .get(environment.endpoint + "animal/request")
      .then((data) => {
        console.log(data.data.requests);
        setData(data.data.requests);
      })
      .catch((error) => console.log(error));
  }, count);

  async function resolve(id, index) {
    if (!window.confirm("Are you sure you want to resolve?")) {
      return false;
    }

    // console.log(id, index);
    const response = await axios.get(
      environment.endpoint + "animal/resolve/" + id
    );

    data[index]["resolved"] = 1;
    setData([...data]);
    count[0] = 2;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 p-4 mt-4 mx-auto">
          <h3>Manage Pet Requests</h3>
          <h6 className="mt-4 mb-4">
            Resolve the requests which are already given or rejected for
            adoption.
          </h6>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Request ID</th>
                <th scope="col">Pet Name</th>
                <th scope="col">Image</th>
                <th scope="col">Requested By</th>
                <th scope="col">Address</th>
                <th scope="col">Phone</th>
                <th scope="col">Reason</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td>{row.request_id}</td>
                  <td>{row.ani_animal_name}</td>
                  <td>
                    <img
                      src={environment.basepath + "uploads/" + row.ani_image}
                      width={100}
                    />
                  </td>
                  <td>
                    {row.user_first_name} {row.user_lastname}
                  </td>
                  <td>
                    {row.address_1} <br /> {row.address_2}
                  </td>
                  <td> {row.phone}</td>
                  <td>{row.reason}</td>
                  <td>
                    {row.resolved == 1 ? (
                      <button
                        className="btn btn-outline-info disabled"
                        style={{
                          width: "70px",
                          padding: "5px",
                          fontSize: "14px ",
                        }}
                      >
                        Resolved
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-info  "
                        style={{
                          width: "60px",
                          padding: "5px",
                          fontSize: "14px ",
                        }}
                        onClick={() => resolve(row.request_id, i)}
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
