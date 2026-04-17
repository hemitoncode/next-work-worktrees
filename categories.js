(function () {
  const CONTAINER_ID = "category-breakdown";

  function getContainer() {
    let el = document.getElementById(CONTAINER_ID);
    if (!el) {
      el = document.createElement("article");
      el.id = CONTAINER_ID;
      document.getElementById("features").appendChild(el);
    }
    return el;
  }

  function renderCategories(transactions) {
    const container = getContainer();
    const expenses = transactions.filter((t) => t.type === "expense");

    if (expenses.length === 0) {
      container.innerHTML =
        "<h2>Category Breakdown</h2><p>No expenses recorded yet.</p>";
      return;
    }

    const totals = {};
    for (const t of expenses) {
      const cat = t.category || "Uncategorized";
      totals[cat] = (totals[cat] || 0) + Math.abs(t.amount);
    }

    const totalExpenses = Object.values(totals).reduce((s, v) => s + v, 0);
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);

    let rows = "";
    for (const [category, amount] of sorted) {
      const pct = ((amount / totalExpenses) * 100).toFixed(1);
      rows += `
      <div class="category-row" data-category="${category.toLowerCase().replace(/\s+/g, "-")}">
        <div class="category-header">
          <strong>${category}</strong>
          <span>$${amount.toFixed(2)} (${pct}%)</span>
        </div>
        <progress value="${pct}" max="100">${pct}%</progress>
      </div>`;
    }

    container.innerHTML = `
      <h2>Category Breakdown</h2>
      ${rows}
      <hr>
      <div class="category-total">
        <strong>Total Expenses</strong>
        <strong>$${totalExpenses.toFixed(2)}</strong>
      </div>`;
  }

  registerFeature(renderCategories);
})();
