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

document.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://localhost:3000/transactions")
    .then((res) => {
      allTransactionsData = res.data;
      console.log(allTransactionsData);
      //render product on DOM :
      renderTransactions(res.data, filters);
    })
    .catch((err) => console.log(err));
});

function renderTransactions(_transactions, _filters) {
  const filteredTransaction = _transactions.filter((p) => {
    // console.log(filters);
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



searchInput.addEventListener("input", (e) => {
  filters.searchItems = e.target.value;
  renderTransactions(allTransactionsData, filters);
});
