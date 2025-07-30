document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-button");
  const cards = document.querySelectorAll(".card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const tag = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      cards.forEach(card => {
        if (tag === "all" || card.classList.contains(tag)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // BibTeX toggle
  document.querySelectorAll(".toggle-bib").forEach(btn => {
    btn.addEventListener("click", () => {
      const bibtex = btn.closest(".card").querySelector(".bibtex");
      bibtex.classList.toggle("hidden");
    });
  });
});
