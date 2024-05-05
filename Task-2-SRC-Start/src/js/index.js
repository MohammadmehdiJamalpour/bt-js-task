// Global Variables :

const searchInput = document.querySelector("#search");
const transactions = document.querySelector(".transaction-list__body");
let allTransactionsData = [];
const filters = {
  searchItems: "",
};
const priceDropdownArrow = document.getElementById("price-dropdown-arrow");
const dateDropdownArrow = document.getElementById("date-dropdown-arrow");
const uploadBtn = document.getElementById("upload-btn");
const transactionList = document.querySelector(".transactions-list-container");
const divBtn = document.querySelector(".upload");
let ascending = true;
const searchLabel = document.querySelector(".search-label");

//  Transaction Upload Btn :

uploadBtn.addEventListener("click", function () {
  divBtn.classList.add("hidden");
  transactionList.classList.remove("hidden");
  searchLabel.classList.remove("hidden");
});

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

// Render Function :

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
    const transactionDiv = document.createElement("div");
    transactionDiv.classList.add("transaction");
    transactionDiv.innerHTML = `
    <p class="transaction__order">${index + 1}</p>
    <p class="transaction__type ${statusColor}">${item.type}</p>
    <p class="transaction__price">${item.price}</p>
    <p class="transaction__id">${item.refId}</p>
    <p class="transaction__time">${localDate} ساعت ${localTime}</p>
    `;

    transactions.append(transactionDiv);
  });
}

// Drop Down Events

priceDropdownArrow.addEventListener("click", function () {
  ascending = !ascending;
  const sortOrder = ascending ? "price" : "-price";
  const sortValue = "price";
  const url = `http://localhost:3000/transactions?sort=${sortOrder}`;
  axios
    .get(url)
    .then((res) => {
      allTransactionsData = res.data;

      // Sort Data based on Price
      sortBy(allTransactionsData, sortOrder, sortValue);
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
  const sortValue = "date";
  const url = `http://localhost:3000/transactions?sort=${sortOrder}`;
  axios
    .get(url)
    .then((res) => {
      allTransactionsData = res.data;
      // sort data base on dates
      sortBy(allTransactionsData, sortOrder, sortValue);
      renderTransactions(allTransactionsData, filters);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  this.classList.toggle("rotate180");
});

// Status Color style Function

const checkColor = (item) =>
  item.type === "افزایش اعتبار" ? "transaction__success" : "transaction__fail";

// Input data
searchInput.addEventListener("input", (e) => {
  filters.searchItems = e.target.value;
  renderTransactions(allTransactionsData, filters);
});

// Sort Function
function sortBy(data, sortOrder, sortValue) {
  const isAscending = !sortOrder.startsWith("-");
  console.log(data, sortValue, sortValue);
  return data.sort((a, b) => {
    const itemA = a[sortValue];
    const itemB = b[sortValue];
    if (isAscending) {
      return itemB - itemA;
    } else {
      return itemA - itemB;
    }
  });
}
