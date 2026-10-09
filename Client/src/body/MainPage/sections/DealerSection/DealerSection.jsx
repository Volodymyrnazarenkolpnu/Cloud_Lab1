import "./DealerSection.styles.css";
import DealerPicture from "../../../../images/Screenshot 2025-10-27 at 22-08-38 Офіційний онлайн ресурс STIHL › STIHL Україна.png"

const DealerSection = () => {
    return(
        <div className="MainDealerDiv">
            <div className="TextDiv">
                <a className="BigText">
                    MY DZHMIHL: один аккаунт для всіх ваших продуктів DZHMIHL
                </a>
                <a className="SmallText">
                    Вам більше не доведеться запам’ятовувати дату покупки, серійний номер пристрою чи наступний термін його сервісного обслуговування. Із порталом MySTIHL ви отримуєте безліч персональних переваг, маючи один обліковий запис для всіх ваших пристроїв STIHL.
                </a>
                <div className="ButtonDiv">
                    <button className="WhiteButon">
                        Знайти Дилера
                    </button>
                    <button className="OrangeButon">
                        Записатись на сервіс
                    </button>
                </div>
            </div>
            <img src={DealerPicture} style={{borderWidth:"0px"}}>
            </img>
        </div>
    );
};

export default DealerSection;