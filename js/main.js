const dropList = document.querySelectorAll("form select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
  for (let currencyCode in countryList) {
    let selected =
      i == 0
        ? currencyCode == "EUR"
          ? "selected"
          : ""
        : currencyCode == "XOF"
        ? "selected"
        : "";
    let optionTag = `<option value="${currencyCode}" ${selected}>${currencyCode}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }

  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

const loadFlag = (element) => {
  for (let code in countryList) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      const countryCode = countryList[code];
      imgTag.src = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
    }
  }
};

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");

exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

const getExchangeRate = () => {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;

  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }

  exchangeRateTxt.innerText = "Loading...";

  let myHeaders = new Headers();
  myHeaders.append("apikey", apikey);

  const requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };

  const url = `https://api.apilayer.com/exchangerates_data/convert?to=${toCurrency.value}&from=${fromCurrency.value}&amount=${amount.value}`;

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const { from, to, amount } = result.query;
      const resultCurrency = result.result;

      exchangeRateTxt.innerText = `${amount} ${from} = ${resultCurrency} ${to}`;
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Une erreur s'est produite...";
    });
};
