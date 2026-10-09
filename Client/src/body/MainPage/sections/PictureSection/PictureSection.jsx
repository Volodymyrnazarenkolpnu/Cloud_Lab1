import "./PictureSection.styles.css";
import MSPromoPic from "../../../../images/MS_Promo_5120x1710_9908_2025-10.jpg"

const PictureSection = () => {
    return(
        <div className="Section1Div">
            <div className="AlignBodyDiv">
                <img alt="Picture" src={MSPromoPic} width="100%">

                </img>
            </div>
        </div>
    );
};

export default PictureSection;