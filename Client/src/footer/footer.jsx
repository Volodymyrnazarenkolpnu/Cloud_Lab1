import "./footer.styles.css";
import { YoutubeOutlined, InstagramOutlined, FacebookOutlined, TikTokOutlined, MailOutlined } from "@ant-design/icons"

const Footer = () => {
    return(
        <footer>
            <OrangeSection/>
            <GraySection/>
        </footer>
    );   
};

const OrangeSection = () => {
    return(
        <div className="OrangeSectionDiv">
            <div className="LogoDiv">
                <YoutubeOutlined />
            </div>
            <div className="LogoDiv">
                <InstagramOutlined />
            </div>
            <div className="LogoDiv">
                <FacebookOutlined />
            </div>
            <div className="LogoDiv">
                <TikTokOutlined />
            </div>
        </div>
    );
};

const GraySection = () => {
    return(
    <div className="GraySectionDiv">
        <div className="TextBlockDiv">
            <div className="TextBlock">
                <a className="BoldText">
                    Меню
                </a>
                <a className="Regtext">
                    Техніка та ручний інструмент
                </a>
                <a className="Regtext">
                    Аксесуари та приладдя
                </a>
                <a className="Regtext">
                    Захисний одяг
                </a>
                <a className="Regtext">
                    Новини та акції
                </a>
            </div>
            <div className="TextBlock">
                <a className="BoldText">
                    Важливо знати
                </a>
                <a className="Regtext">
                    Про нас       
                </a>
                <a className="Regtext">
                    Доставка та оплата
                </a>
                <a className="Regtext">
                    Контакти
                </a>
                <a className="Regtext">
                    Блог
                </a>
            </div>
            <div className="TextBlock">
                <a className="BoldText">
                    Зворотний зв'язок
                </a>
                <a className="Regtext">
                    Сайт працює в тестовому режимі. Деякі матеріали чи функції можуть бути недоступні. У випадку виявлення невідповідностей, будь ласка, повідомте нас через форму зворотного зв'язку. 
                </a>
                <a className="Regtext">
                    <MailOutlined style={{margin:"5px"}} />
                    info@dzhmihl.ua
                </a>
                <a className="Regtext">
                     Офіційний інформаційний сайт
                </a>
                <a className="BoldText">
                    www.dzhmihl.ua
                </a>
            </div>
        </div>
        <div className="UnderTextDiv">
            <div>
                <a className="Regtext">
                    Політика конфіденційності
                </a>
                <a className="Regtext">
                    Угода користувача
                </a>
                <a className="Regtext">
                    Записатись на сервіс
                </a>
                <a className="Regtext">
                    Гарантійні Умови
                </a>
                <a className="Regtext">
                    Як стати дилером
                </a>
            </div>
            <a className="Regtext">
                ТОВ Андреас Джміль © 2025 by Shop-Express
            </a>
        </div>
    </div>
    );
};

export default Footer;