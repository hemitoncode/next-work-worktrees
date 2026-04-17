(function () {
  let container;

  function init() {
    container = document.createElement("article");
    document.getElementById("features").appendChild(container);
    registerFeature(render);
  }

  function render(transactions) {
    container.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = "Transactions";
    container.appendChild(heading);

    container.appendChild(buildForm());
    container.appendChild(buildTable(transactions));
  }

  function buildForm() {
    const form = document.createElement("form");
    form.addEventListener("submit", handleSubmit);

    form.innerHTML = `
      <div class="grid">
        <label>
          Description
          <input type="text" name="description" required>
        </label>
        <label>
          Amount
          <input type="number" name="amount" step="0.01" min="0.01" required>
        </label>
      </div>
      <div class="grid">
        <label>
          Category
          <select name="category" required>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          Income
          <input type="checkbox" name="type" role="switch">
        </label>
      </div>
      <button type="submit">Add Transaction</button>
    `;

    return form;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const transactions = loadTransactions();

    transactions.push({
      id: Date.now(),
      description: form.description.value.trim(),
      amount: parseFloat(form.amount.value),
      category: form.category.value,
      type: form.type.checked ? "income" : "expense",
    });

    saveTransactions(transactions);
  }

  function buildTable(transactions) {
    const wrapper = document.createElement("figure");

    if (transactions.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No transactions yet.";
      wrapper.appendChild(p);
      return wrapper;
    }

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
    `;

    const tbody = document.createElement("tbody");
    for (const tx of transactions) {
      const tr = document.createElement("tr");
      tr.classList.add(tx.type);
      tr.innerHTML = `
        <td>${escapeHtml(tx.description)}</td>
        <td>${escapeHtml(tx.category)}</td>
        <td>${tx.type === "income" ? "+" : "-"}$${tx.amount.toFixed(2)}</td>
        <td><button class="outline secondary delete-btn" data-id="${tx.id}">Delete</button></td>
      `;
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    table.addEventListener("click", function (e) {
      const btn = e.target.closest(".delete-btn");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const updated = loadTransactions().filter((tx) => tx.id !== id);
      saveTransactions(updated);
    });

    wrapper.appendChild(table);
    return wrapper;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
