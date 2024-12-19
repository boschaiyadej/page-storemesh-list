document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://67640b2b17ec5852caeaf535.mockapi.io/storemesh";
  const dataList = document.querySelector(".data-list");
  const paginationLeft = document.querySelector(".btn-pagination-left");
  const paginationRight = document.querySelector(".btn-pagination-right");
  const paginationNumber = document.querySelector(".pagination-number");
  const itemsPerPage = 8;
  let currentPage = 1;
  let data = [];
  let filteredData = [];
  const loadingSpinner = document.getElementById("loading-spinner");
  let sortDirection = "asc";

  // api
  async function fetchData() {
    try {
      loadingSpinner.style.display = "block";

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      data = await response.json();
      filteredData = [...data];
      renderData();
      updatePagination();
    } catch (error) {
      console.error("Error:", error);
      dataList.innerHTML = `<p>Error loading data.</p>`;
    } finally {
      loadingSpinner.style.display = "none";
    }
  }

  function renderData() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    dataList.innerHTML = "";
    paginatedData.forEach((item) => {
      const dataCard = document.createElement("div");
      dataCard.classList.add("data-card");

      const dataListLeft = document.createElement("div");
      dataListLeft.classList.add("data-card-left");
      dataListLeft.innerHTML = `
        <img src="${
          item.image || "placeholder.jpg"
        }" alt="Data Image" class="data-image" />
        <div class="data-title">${item.title || "No Title"}</div>
      `;

      const dataRight = document.createElement("div");
      dataRight.classList.add("data-right");
      dataRight.innerHTML = `
        <div class="data-quantity">${item.quantity || 0}</div>
      `;

      dataCard.appendChild(dataListLeft);
      dataCard.appendChild(dataRight);
      dataList.appendChild(dataCard);
    });
  }

  function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    paginationNumber.innerHTML = currentPage;

    paginationLeft.disabled = currentPage === 1;
    paginationLeft.style.color = currentPage === 1 ? "#BDBDBD" : "#333";

    paginationRight.disabled = currentPage === totalPages;
    paginationRight.style.color =
      currentPage === totalPages ? "#BDBDBD" : "#333";
  }

  // Pagination
  paginationLeft.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderData();
      updatePagination();
    }
  });

  paginationRight.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderData();
      updatePagination();
    }
  });

  // Sort data
  const sortToggle = document.getElementById("sort-toggle");
  const sortIcon = document.getElementById("sort-icon");

  sortToggle.addEventListener("click", () => {
    if (sortDirection === "asc") {
      sortDirection = "desc";
      sortIcon.classList.remove("fa-caret-up");
      sortIcon.classList.add("fa-caret-down");
    } else {
      sortDirection = "asc";
      sortIcon.classList.remove("fa-caret-down");
      sortIcon.classList.add("fa-caret-up");
    }

    sortData("quantity", sortDirection);
    renderData();
    updatePagination();
  });

  function sortData(field, direction) {
    if (field === "quantity") {
      filteredData.sort((a, b) => {
        if (direction === "asc") {
          return a.quantity - b.quantity;
        } else {
          return b.quantity - a.quantity;
        }
      });
    }
  }

  // Filter
  const filterSelect = document.getElementById("filter-select");

  filterSelect.addEventListener("change", (e) => {
    const filterValue = e.target.value;
    filterData(filterValue);
    renderData();
    updatePagination();
  });

  function filterData(filterValue) {
    if (filterValue === "") {
      filteredData = [...data];
    } else if (filterValue === "<30000") {
      filteredData = data.filter((item) => item.quantity < 30000);
    } else if (filterValue === "30000-60000") {
      filteredData = data.filter(
        (item) => item.quantity >= 30000 && item.quantity <= 60000
      );
    } else if (filterValue === ">60000") {
      filteredData = data.filter((item) => item.quantity > 60000);
    }

    sortData("quantity", sortDirection);
  }

  fetchData();
});
