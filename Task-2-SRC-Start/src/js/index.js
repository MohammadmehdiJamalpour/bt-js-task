
const searchInput = document.querySelector("#search");
const transactions = document.querySelector('.transactions');
const btn = document.querySelectorAll(".btn");
let allTransactionsData = [];
const filters= {
    searchItems : "",
}

document.addEventListener("DOMContentLoaded", () => {
    axios
      .get("http://localhost:3000/transactions")
      .then((res) =>{ 
          allTransactionsData = res.data;
          //render product on DOM :
          //   renderTransactions(res.data,filters)
        })
        .catch((err) => console.log(err));
    });