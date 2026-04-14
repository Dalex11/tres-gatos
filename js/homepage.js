document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("newsSearch");
  const sortToggleButton = document.getElementById("sortToggleButton");
  const authorModalButton = document.getElementById("authorModalButton");
  const closeAuthorModal = document.getElementById("closeAuthorModal");
  const authorModal = document.getElementById("authorModal");
  const newsList = document.getElementById("newsList");
  const cards = Array.from(document.querySelectorAll(".news-card"));

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function filterCards() {
    const query = normalize(searchInput.value);

    cards.forEach((card) => {
      const title = normalize(card.dataset.title);
      const tags = normalize(card.dataset.tags);
      const author = normalize(card.dataset.author);
      const category = normalize(card.dataset.category);

      const matchesSearch =
        !query ||
        title.includes(query) ||
        tags.includes(query) ||
        author.includes(query) ||
        category.includes(query);

      card.style.display = matchesSearch ? "grid" : "none";
    });
  }

  function sortCards(order) {
    const sorted = cards.slice().sort((a, b) => {
      const dateA = new Date(a.dataset.date).getTime();
      const dateB = new Date(b.dataset.date).getTime();
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    sorted.forEach((card) => newsList.appendChild(card));
  }

  function toggleSort() {
    const currentOrder = sortToggleButton.dataset.order;
    const nextOrder = currentOrder === "desc" ? "asc" : "desc";
    sortToggleButton.dataset.order = nextOrder;
    sortToggleButton.textContent = nextOrder === "desc" ? "Ordenar: más reciente" : "Ordenar: más antiguo";
    sortCards(nextOrder);
  }

  sortToggleButton.addEventListener("click", function () {
    toggleSort();
  });

  searchInput.addEventListener("input", filterCards);
  searchInput.addEventListener("change", filterCards);

  authorModalButton.addEventListener("click", function () {
    authorModal.hidden = false;
    document.body.style.overflow = "hidden";
  });

  closeAuthorModal.addEventListener("click", function () {
    authorModal.hidden = true;
    document.body.style.overflow = "";
  });

  authorModal.addEventListener("click", function (event) {
    if (event.target === authorModal) {
      authorModal.hidden = true;
      document.body.style.overflow = "";
    }
  });

  sortCards(sortToggleButton.dataset.order);
});