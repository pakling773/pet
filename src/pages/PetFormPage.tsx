import ManagePetsSidebar from "../components/managePets/ManagePetsSidebar";
import AddNewPetBreadcumb from "../components/petForm/AddNewPetBreadcumb";
import PetFormComponent from "../components/petForm/PetFormComponent";

function PetFormPage() {
  return (
    <>
      <AddNewPetBreadcumb />
      <div className="shop-area pt-110 pb-110">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-8 order-2 order-lg-0">
              <ManagePetsSidebar />
            </div>
            <div className="col-lg-9">
              <div className="shop-wrap">
                <PetFormComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PetFormPage;
