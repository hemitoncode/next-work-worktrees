const STORAGE_KEY = "budget_transactions";

function loadTransactions() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  renderAll();
}

const featureRenderers = [];

function registerFeature(renderFn) {
  featureRenderers.push(renderFn);
}

function renderAll() {
  const transactions = loadTransactions();
  for (const render of featureRenderers) {
    render(transactions);
  }
}

document.addEventListener("DOMContentLoaded", renderAll);
