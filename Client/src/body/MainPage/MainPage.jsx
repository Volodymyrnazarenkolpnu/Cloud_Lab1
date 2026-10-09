import "./MainPage.styles.css";
import PictureSection from "./sections/PictureSection/PictureSection";
import ItemScrollSection from "./sections/ItemScrollSection/ItemScrollSection";
import NewsSection from "./sections/NewsSection/NewsSection";
import DealerSection from "./sections/DealerSection/DealerSection";

const MainPage = () => {
    return(
        <div className="MainBodyDiv">
            <PictureSection />
            <ItemScrollSection />
            <NewsSection />
            <DealerSection />
        </div>
    );
};

export default MainPage;