import PetDetailsArea from "../components/petdetails/PetDetailsArea";
import PetDetailsBreadcumb from "../components/petdetails/PetDetailsBreadcumb";

function PetDetailsPage(props) {
  return (
    <main>
      <PetDetailsBreadcumb />
      <PetDetailsArea OnAddToFav={props.OnAddToFav} favItems={props.favItems} />
    </main>
  );
}
export default PetDetailsPage;
