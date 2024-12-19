document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://67640b2b17ec5852caeaf535.mockapi.io/storemesh";
  const dataList = document.querySelector(".data-list");

  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      renderData(data);
    } catch (error) {
      console.error("Error:", error);
      dataList.innerHTML = `<p>Error loading data.</p>`;
    }
  }

  function renderData(data) {
    dataList.innerHTML = "";
    data.forEach((item) => {
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
          <div class="data-quantity"> ${item.quantity || 0}</div>
        `;

      dataCard.appendChild(dataListLeft);
      dataCard.appendChild(dataRight);
      dataList.appendChild(dataCard);
    });
  }

  fetchData();
});
