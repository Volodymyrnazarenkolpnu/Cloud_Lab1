import "./NewsSection.styles.css";
import BigNewsBoxPicture from "../../../../images/Screenshot_20251027_134813.png";


const newsdata = [{
    picture: BigNewsBoxPicture,
    title: "ЛЕГКИЙ СТАРТ ВОСЕНИ: -10% НА СУЧАСНІ БЕНЗОПИЛИ",
    text: "Осінь - час діяти! Бензопили для нового сезону вже доступні. Скористайтеся спеціальною акцією та придбайте надійні моделі зі ЗНИЖКОЮ 10% з 1 вересня по 30 листопада 20 листопада в офіційній..."
},
{
    picture: BigNewsBoxPicture,
    title: "СЕРПНЕВІ ЗНИЖКИ ДО 25% НА НАШ ТОП 3 - АКЦІЮ ПРОДОВЖЕНО",
    text: "Ми підібрали саме ті інструменти, що допоможуть упоратися з основними роботами на вашом подвір'ї! ТОП надійних помічників DZHMIHL для актуальних задач у цьому сезоні"
},
]

const  NewsSection  = () => {
    return(
        <div className="NewsSectionDiv">
            <a className="TitleText">
                 АКТУАЛЬНЕ ВІД STIHL: НОВИНИ ТА АКЦІЇ
            </a>
            <div className="NewsBoxCardDiv">
                {newsdata.map((item) => (
                    <BigNewsBox
                        picture = {item.picture}
                        title ={item.title}
                        text = {item.text}
                    />
                ))}
            </div>
        </div>
    );
};

const BigNewsBox = ({picture, title, text}) => {
    return(
        <div className="BigNewsBoxDiv">
            <img src={picture}>
            
            </img>
            <a className="TitleText">
                {title}
            </a>
            <a className="RegText">
                {text}
            </a>
            <a className="NewsBoxButton">
                Детальніше
            </a>
        </div>
    );
}

export default NewsSection;