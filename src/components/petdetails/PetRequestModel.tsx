import axios from "axios";
import { environment } from "../../environment/environment";
import AuthService from "../../common/Auth.service";
import $ from "jquery";

export default function PetRequestModal(props) {
  const user_id = AuthService.getUserId();

  const request = async () => {
    console.log(user_id);
    const reason: String = (
      document.getElementById("reason") as HTMLInputElement
    ).value;

    const data = {
      user_id: user_id,
      animal_id: props.animal_id,
      reason: reason,
    };

    if (reason !== "") {
      const response = await axios.post(
        environment.endpoint + "animal/request",
        data
      );

      if (response.data.success) {
        alert("Pet requested for adoption. We will contact you soon");
        var locModal: any = document.getElementById("requestModal");
        var back: any = document.getElementsByClassName(
          "modal-backdrop"
        ) as HTMLCollection;
        locModal.style.display = "none";

        locModal.className = "modal fade";
        back[0].style.opacity = 0;
        back[0].style.display = "none";

        var modalOpen: any = document.getElementsByClassName(
          "modal-open"
        ) as HTMLCollection;
        modalOpen[0].style.overflow = "auto";
        $("#reason").val("");
      }
    } else {
      alert("Please enter why do you want to adopt this pet.");
    }
  };

  return (
    <div className="modal" role="dialog" id="requestModal">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Request Pet</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h6>Why Do You Want To Adopt This Pet?</h6>
            <textarea
              name="reason"
              id="reason"
              style={{ width: "100%" }}
              rows={11}
            ></textarea>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              id="request-button"
              onClick={request}
            >
              Request For Adoption
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
