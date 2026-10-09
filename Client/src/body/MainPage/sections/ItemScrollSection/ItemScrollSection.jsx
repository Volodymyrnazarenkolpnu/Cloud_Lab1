import "./ItemScrollSection.styles.css";
import MiniItemCardJpg from "../../../../images/95772_MS-MOTORSAEGEN_RANGE-IM-002_s-ratio-10x10-proportions-jpg.jpg"
import { CaretLeftFilled, CaretRightFilled } from "@ant-design/icons"

const mincards = [
    {
        picture: MiniItemCardJpg,
        text: "Весь асортимент"
    },
    {
        picture: MiniItemCardJpg,
        text: "Ланцюгові мотопили"
    },
    {
        picture: MiniItemCardJpg,
        text: "Акумуляторні пили"
    },
    {
        picture: MiniItemCardJpg,
        text: "Акумуляторні пристрої"
    },
    {
        picture: MiniItemCardJpg,
        text: "Роботи-косарки iMOW"
    },
    {
        picture: MiniItemCardJpg,
        text: "Мийки високого тиску"
    },
];

const ItemScrollSection = () => {
    return(
        <div className="Section2Div">
            <div className="Section2Button">
                <CaretLeftFilled />
            </div>
                {mincards.map((data) => (
                    <MiniItemCardEl
                    picture = {data.picture}
                    text = {data.text} />
                ))}
            <div className="Section2Button">
                <CaretRightFilled />
            </div>
        </div>
    );
};

const MiniItemCardEl = ({picture, text}) => {
    return(
        <div className="MiniItemCard">
            <img className="MiniItemCardImg" src={picture} />
                <a>
                    {text}
                </a>
        </div>
    );
}

export default ItemScrollSection;