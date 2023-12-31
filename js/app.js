// 1. Create classes with private and public properties, and public methods
// 2. Add event listeners with render DOM methods

// NOTES:
// In Vanilla JS you have to cause the DOM to 'render' each time we update the DOM (ie addIncome, addExpense), therefore...
// We need to make a 'render' private method of the class to call each render method AND call each of those render methods in the constructor

class BudgetTracker {
  constructor() {
    this._budgetLimit = Storage.getBudgetLimit();
    this._totalAmount = Storage.getTotalAmount(0);
    this._income = Storage.getIncome();
    this._expenses = Storage.getExpenses();

    this._displayBudgetLimit();
    this._displayBudgetTotal();
    this._displayBudgetIncome();
    this._displayBudgetExpenses();
    this._displayBudgetRemaining();
    this._displayBudgetProgress();

    document.getElementById('limit').value = this._budgetLimit;
  }

  // Publice Methods/API
  addIncome(income) {
    this._income.push(income);
    this._totalAmount += income.amount;
    Storage.updateTotalAmount(this._totalAmount);
    Storage.saveIncome(income);
    this._displayNewIncome(income);
    this._render();
  }

  addExpense(expense) {
    this._expenses.push(expense);
    this._totalAmount -= expense.amount;
    Storage.updateTotalAmount(this._totalAmount);
    Storage.saveExpense(expense);
    this._displayNewExpense(expense);
    this._render();
  }

  removeIncome(id) {
    const index = this._income.findIndex((income) => income.id === id);

    if (index != -1) {
      const income = this._income[index];
      this._totalAmount -= income.amount;
      Storage.updateTotalAmount(this._totalAmount);
      this._income.splice(index, 1);
      Storage.removeIncome(id);
      this._render();
    }
  }

  removeExpense(id) {
    const index = this._expenses.findIndex((expense) => expense.id === id);

    if (index != -1) {
      const expense = this._expenses[index];
      this._totalAmount += expense.amount;
      Storage.updateTotalAmount(this._totalAmount);
      this._expenses.splice(index, 1);
      Storage.removeExpense(id);
      this._render();
    }
  }

  reset() {
    this._totalAmount = 0;
    this._income = [];
    this._expenses = [];
    Storage.clearAll();
    this._render();
  }

  setLimit(budgetLimit) {
    this._budgetLimit = budgetLimit;
    Storage.setBudgetLimit(budgetLimit);
    this._displayBudgetLimit();
    this._render();
  }

  loadItems() {
    this._income.forEach((item) => this._displayNewIncome(item));
    this._expenses.forEach((item) => this._displayNewExpense(item));
  }

  // Private Methods/API
  _displayBudgetTotal() {
    const total = this._totalAmount;
    const totalBudgetEl = document.getElementById('budget-total');
    totalBudgetEl.innerHTML = this._totalAmount;

    if (total < 0) {
      totalBudgetEl.parentElement.parentElement.classList.remove('bg-primary');
      totalBudgetEl.parentElement.parentElement.classList.add('bg-danger');
    } else {
      totalBudgetEl.parentElement.parentElement.classList.remove('bg-danger');
      totalBudgetEl.parentElement.parentElement.classList.add('bg-primary');
    }
  }

  _displayBudgetLimit() {
    const budgetLimitEl = document.getElementById('budget-limit');
    budgetLimitEl.innerHTML = this._budgetLimit;
  }

  _displayBudgetIncome() {
    const budgetIncomeEl = document.getElementById('budget-income');

    const incomeItems = this._income.reduce(
      (total, income) => total + income.amount,
      0
    );

    budgetIncomeEl.innerHTML = incomeItems;
  }

  _displayBudgetExpenses() {
    const budgetExpensesEl = document.getElementById('budget-expenses');

    const expenseItems = this._expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    budgetExpensesEl.innerHTML = expenseItems;
  }

  _displayBudgetRemaining() {
    const budgetRemainingEl = document.getElementById('budget-remaining');
    const progressEl = document.getElementById('budget-progress');
    const expenses = this._expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    const remaining = this._budgetLimit - expenses;

    budgetRemainingEl.innerHTML = remaining;

    if (remaining < 0) {
      budgetRemainingEl.parentElement.parentElement.classList.remove(
        'bg-light'
      );
      budgetRemainingEl.parentElement.parentElement.classList.add('bg-danger');

      progressEl.classList.remove('bg-success');
      progressEl.classList.add('bg-danger');
    } else {
      budgetRemainingEl.parentElement.parentElement.classList.remove(
        'bg-danger'
      );
      budgetRemainingEl.parentElement.parentElement.classList.add('bg-light');

      progressEl.classList.remove('bg-danger');
      progressEl.classList.add('bg-success');
    }
  }

  _displayBudgetProgress() {
    const progressEl = document.getElementById('budget-progress');
    const percentage = (this._totalAmount / this._budgetLimit) * 100;

    const width = Math.min(percentage, 100);

    progressEl.style.width = `${width}%`;
  }

  _displayNewIncome(income) {
    const incomesEl = document.getElementById('income-items');
    const incomeEl = document.createElement('div');
    incomeEl.classList.add('card', 'my-2');
    incomeEl.setAttribute('data-id', income.id);
    incomeEl.innerHTML = `
    <div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${income.name}</h4>
      <div
        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
      >
        ${income.amount}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
    `;

    incomesEl.appendChild(incomeEl);
  }

  _displayNewExpense(expense) {
    const expensesEl = document.getElementById('expense-items');
    const expenseEl = document.createElement('div');
    expenseEl.classList.add('card', 'my-2');
    expenseEl.setAttribute('data-id', expense.id);
    expenseEl.innerHTML = `
    <div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${expense.name}</h4>
      <div
        class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
      >
        ${expense.amount}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
    `;

    expensesEl.appendChild(expenseEl);
  }

  _render() {
    this._displayBudgetTotal();
    this._displayBudgetIncome();
    this._displayBudgetExpenses();
    this._displayBudgetRemaining();
    this._displayBudgetProgress();
  }
}

class Income {
  constructor(name, amount) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.amount = amount;
  }
}

class Expense {
  constructor(name, amount) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.amount = amount;
  }
}

class Storage {
  static getBudgetLimit(defaultLimit = 4500) {
    let budgetLimit;
    if (localStorage.getItem('budgetLimit') === null) {
      budgetLimit = defaultLimit;
    } else {
      budgetLimit = +localStorage.getItem('budgetLimit');
    }

    return budgetLimit;
  }

  static setBudgetLimit(budgetLimit) {
    localStorage.setItem('budgetLimit', budgetLimit);
  }

  static getTotalAmount(defaultAmount = 0) {
    let totalAmount;
    if (localStorage.getItem('totalAmount') === null) {
      totalAmount = defaultAmount;
    } else {
      totalAmount = +localStorage.getItem('totalAmount');
    }

    return totalAmount;
  }

  static updateTotalAmount(amount) {
    localStorage.setItem('totalAmount', amount);
  }

  static getIncome() {
    let income;
    if (localStorage.getItem('income') === null) {
      income = [];
    } else {
      income = JSON.parse(localStorage.getItem('income'));
    }

    return income;
  }

  static saveIncome(newIncome) {
    const income = Storage.getIncome();
    income.push(newIncome);
    localStorage.setItem('income', JSON.stringify(income));
  }

  static removeIncome(id) {
    const incomes = Storage.getIncome();
    incomes.forEach((income, index) => {
      if (income.id === id) {
        incomes.splice(index, 1);
      }
    });

    localStorage.setItem('income', JSON.stringify(incomes));
  }

  static getExpenses() {
    let expenses;
    if (localStorage.getItem('expenses') === null) {
      expenses = [];
    } else {
      expenses = JSON.parse(localStorage.getItem('expenses'));
    }

    return expenses;
  }

  static saveExpense(newExpense) {
    const expenses = Storage.getExpenses();
    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  static removeExpense(id) {
    const expenses = Storage.getExpenses();
    expenses.forEach((expense, index) => {
      if (expense.id === id) {
        expenses.splice(index, 1);
      }
    });

    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  static clearAll() {
    // Keeping budgetLimit
    localStorage.removeItem('totalAmount');
    localStorage.removeItem('expenses');
    localStorage.removeItem('income');

    // To clear everything including budgetLimit
    // localStorage.clear();
  }
}

class App {
  constructor() {
    this._tracker = new BudgetTracker();
    this._loadEventListeners();
    this._tracker.loadItems();
  }

  _loadEventListeners() {
    document
      .getElementById('income-form')
      .addEventListener('submit', this._newItem.bind(this, 'income'));
    document
      .getElementById('expense-form')
      .addEventListener('submit', this._newItem.bind(this, 'expense'));

    document
      .getElementById('income-items')
      .addEventListener('click', this._removeItem.bind(this, 'income'));

    document
      .getElementById('expense-items')
      .addEventListener('click', this._removeItem.bind(this, 'expense'));

    document
      .getElementById('filter-income')
      .addEventListener('keyup', this._filterItems.bind(this, 'income'));

    document
      .getElementById('filter-expenses')
      .addEventListener('keyup', this._filterItems.bind(this, 'expense'));

    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this));

    document
      .getElementById('limit-form')
      .addEventListener('click', this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const amount = document.getElementById(`${type}-amount`);

    // Validate inputs
    if (name.value === '' || amount.value === '') {
      alert('Please fill in all fields');
      return;
    }

    if (type === 'income') {
      const income = new Income(name.value, +amount.value);
      this._tracker.addIncome(income);
    } else {
      const expense = new Expense(name.value, +amount.value);
      this._tracker.addExpense(expense);
    }

    name.value = '';
    amount.value = '';

    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, {
      toggle: true,
    });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('Are you sure?')) {
        const id = e.target.closest('.card').getAttribute('data-id');
        console.log(id);

        type === 'income'
          ? this._tracker.removeIncome(id)
          : this._tracker.removeExpense(id);

        e.target.closest('.card').remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  _reset() {
    this._tracker.reset();

    document.getElementById('income-items').innerHTML = '';
    document.getElementById('expense-items').innerHTML = '';
    document.getElementById('filter-income').value = '';
    document.getElementById('filter-expenses').value = '';
  }

  _setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById('limit');

    if (limit.value === '') {
      alert('Please add a limit!');
      return;
    }

    this._tracker.setLimit(+limit.value);
    limit.value = '';

    const modalEl = document.getElementById('limit-modal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
