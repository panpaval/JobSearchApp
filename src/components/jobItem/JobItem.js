import { useContext } from "react";
import "./jobItem.css";
import { JobsContext } from "../app/App";
import locationImage from "./Location.svg";
import getSymbolFromCurrency from "currency-symbol-map";

function Item({ data, onClick }) {
  const { favorites, setFavorites, isJobDescriptionPage } =
    useContext(JobsContext);
  const textColor = isJobDescriptionPage ? "black" : "#5E96FC";
  const fontSize = isJobDescriptionPage ? "28px" : "20px";
  const itemHight = isJobDescriptionPage ? "120px" : "101px";

  const isActiveStar = favorites.some((item) => item.id === data.id);

  const handleClick = (event) => {
    event.stopPropagation(); // Остановить всплытие события, что бы обработчик на родительском не вступал в конфликт со звездой
    if (isActiveStar) {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((item) => item.id !== data.id)
      );
    } else {
      setFavorites((prevFavorites) => [...prevFavorites, data]);
    }
  };

  const getCurrencyByCountry = (country) => {
    const countryMap = {
      "United Kingdom": "GBP",
      UK: "GBP",
      "United States": "USD",
      Deutschland: "EUR",
      France: "EUR",
      Italia: "EUR",
      Nederland: "EUR",
      Österreich: "EUR",
      België: "EUR",
      España: "EUR",
      Canada: "CAD",
      Australia: "AUD",
      Brasil: "BRL",
      Polska: "PLN",
      India: "INR",
      Singapore: "SGD",
      "South Africa": "ZAR",
      Schweiz: "CHF",
      México: "MXN",
    };

    if (country in countryMap) {
      return countryMap[country];
    }

    const euroCountries = [
      "Deutschland",
      "France",
      "Italia",
      "Nederland",
      "Österreich",
      "België",
      "España",
    ];

    if (euroCountries.includes(country)) {
      return "EUR";
    }

    return "USD";
  };

  const currency = getCurrencyByCountry(data.country);
  console.log("CountryName", data.country);
  const currencySymbol = getSymbolFromCurrency(currency);

  return (
    <div
      className="item-container"
      onClick={onClick}
      style={{ height: itemHight }}
    >
      <div className="job-info">
        <div
          className="job-title"
          style={{ color: textColor, fontSize: fontSize }}
        >
          {data.profession}
        </div>
        <div
          className={isActiveStar ? "activeStar" : "star"}
          onClick={handleClick}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="star-icon"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.9718 2.70846C11.4382 1.93348 12.5618 1.93348 13.0282 2.70847L15.3586 6.58087C15.5262 6.85928 15.7995 7.05784 16.116 7.13116L20.5191 8.15091C21.4002 8.35499 21.7474 9.42356 21.1545 10.1066L18.1918 13.5196C17.9788 13.765 17.8744 14.0863 17.9025 14.41L18.2932 18.9127C18.3714 19.8138 17.4625 20.4742 16.6296 20.1214L12.4681 18.3583C12.1689 18.2316 11.8311 18.2316 11.5319 18.3583L7.37038 20.1214C6.53754 20.4742 5.62856 19.8138 5.70677 18.9127L6.09754 14.41C6.12563 14.0863 6.02124 13.765 5.80823 13.5196L2.8455 10.1066C2.25257 9.42356 2.59977 8.35499 3.48095 8.15091L7.88397 7.13116C8.20053 7.05784 8.47383 6.85928 8.64138 6.58087L10.9718 2.70846Z"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
      <div className="payment-wrapper">
        <div className="payment-info">
          {data.payment_from ? (
            <>
              от {data.payment_from} {currencySymbol}
            </>
          ) : (
            "Нет данных о ЗП"
          )}
        </div>
        <div className="separator">•</div>
        <div className="type-of-work">{data.type_of_work}</div>
      </div>
      <div className="town-wrapper">
        <img src={locationImage} alt="Logo" />
        <div className="town-info">{data.town}</div>
      </div>
    </div>
  );
}

export default Item;
