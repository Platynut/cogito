import solo from "../icons/solo.png";
import "../css/solo.css";
import SelectCategories from "./SelectCategories";

export default function Solo() {
  

  return (
    <div className="solo-page">
      <img src={solo} alt="Mode Solo" className="solo-logo" />
      <SelectCategories />
    </div>
  );
  
}
