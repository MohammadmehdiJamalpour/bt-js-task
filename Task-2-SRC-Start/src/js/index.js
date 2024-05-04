const searchInput = document.querySelector("#search");
const transactions = document.querySelector(".transaction-list__body");
let allTransactionsData = [];
const filters = {
  searchItems: "",
};
const uploadBtn = document.getElementById("upload-btn");
const transactionList = document.querySelector(".transactions-list-container");
const divBtn = document.querySelector(".upload");
const searchLabel = document.querySelector(".search-label");
uploadBtn.addEventListener("click", function () {
  divBtn.classList.add("hidden");
  transactionList.classList.remove("hidden");
  searchLabel.classList.remove("hidden");
});

// DOM first Load
document.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://localhost:3000/transactions")
    .then((res) => {
      allTransactionsData = res.data;
      //render product on DOM :
      renderTransactions(res.data, filters);
    })
    .catch((err) => console.log(err));
});

// Drop Down

let ascending = true;

const priceDropdownArrow = document.getElementById("price-dropdown-arrow");
const dateDropdownArrow = document.getElementById("date-dropdown-arrow");

priceDropdownArrow.addEventListener("click", function () {
  ascending = !ascending;
  const sortOrder = ascending ? "price" : "-price";
  const url = `http://localhost:3000/transactions?sort=${sortOrder}`;
  axios
    .get(url)
    .then((res) => {
      allTransactionsData = res.data;
      sortByPrice(allTransactionsData, sortOrder);
      renderTransactions(allTransactionsData, filters);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  this.classList.toggle("rotate180");
});

dateDropdownArrow.addEventListener("click", function () {
  ascending = !ascending;
  const sortOrder = ascending ? "date" : "-date";
  const url = `http://localhost:3000/transactions?sort=${sortOrder}`;
  axios
    .get(url)
    .then((res) => {
      allTransactionsData = res.data;
      sortByDate(allTransactionsData, sortOrder);
      renderTransactions(allTransactionsData, filters);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  this.classList.toggle("rotate180");
});

function renderTransactions(_transactions, _filters) {
  const filteredTransaction = _transactions.filter((p) => {
    return new String(p.refId).includes(_filters.searchItems.trim());
  });

  transactions.innerHTML = ``;

  // render to DOM :
  filteredTransaction.forEach((item, index) => {
    let options = { year: "numeric", month: "numeric", day: "numeric" };
    let timeOptions = { hour: "2-digit", minute: "2-digit" };
    const localDate = new Date(item.date).toLocaleDateString("fa-IR", options);
    const localTime = new Date(item.date).toLocaleTimeString(
      "fa-IR",
      timeOptions
    );
    const statusColor = checkColor(item);
    console.log();
    // create
    //add content
    // append to products
    const transactionDiv = document.createElement("div");
    transactionDiv.classList.add("transaction");
    transactionDiv.innerHTML = `
            <p class="transaction__order">${item.id}</p>
            <p class="transaction__type ${statusColor}">${item.type}</p>
            <p class="transaction__price">${item.price}</p>
            <p class="transaction__id">${item.refId}</p>
            <p class="transaction__time">${localDate} ساعت ${localTime}</p>
          `;

    transactions.append(transactionDiv);
  });
}

// Status Color style Function

const checkColor = (item) =>
  item.type === "افزایش اعتبار" ? "transaction__success" : "transaction__fail";


// Input data
searchInput.addEventListener("input", (e) => {
  filters.searchItems = e.target.value;
  renderTransactions(allTransactionsData, filters);
});

// Sort by Price

function sortByPrice(data, sortOrder) {
  const isAscending = sortOrder === "price";
  const isDescending = sortOrder === "-price";

  return data.sort((a, b) => {
    const priceA = parseFloat(a.price);
    const priceB = parseFloat(b.price);

    if (isAscending) {
      return priceA - priceB;
    } else if (isDescending) {
      return priceB - priceA;
    }
  });
}

// Sort By Date

function sortByDate(data, sortOrder) {
  const isAscending = sortOrder === "date";
  const isDescending = sortOrder === "-date";

  return data.sort((a, b) => {
    const timeA = a.date;
    const timeB = b.date;

    if (isAscending) {
      return timeA - timeB;
    } else if (isDescending) {
      return timeB - timeA;
    }
  });
}
