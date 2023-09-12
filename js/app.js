// 1. Create classes with private and public properties, and public methods
// 2. Add event listeners with render DOM methods

// NOTES:
// In Vanilla JS you have to cause the DOM to 'render' each time we update the DOM (ie addIncome, addExpense), therefore...
// We need to make a 'render' private method of the class to call each render method AND call each of those render methods in the constructor

class BudgetTracker {
  constructor() {
    this._budgetLimit = 4000;
    this._totalAmount = 0;
    this._income = [];
    this._expenses = [];

    this._displayBudgetLimit();
    this._displayBudgetTotal();
    this._displayBudgetIncome();
    this._displayBudgetExpenses();
    this._displayBudgetRemaining();
    this._displayBudgetProgress();
  }

  // Publice Methods/API
  addIncome(income) {
    this._income.push(income);
    this._totalAmount += income.amount;
    this._displayNewIncome(income);
    this._render();
  }

  addExpense(expense) {
    this._expenses.push(expense);
    this._totalAmount -= expense.amount;
    this._displayNewExpense(expense);
    this._render();
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

class App {
  constructor() {
    this._tracker = new BudgetTracker();

    document
      .getElementById('income-form')
      .addEventListener('submit', this._newItem.bind(this, 'income'));
    document
      .getElementById('expense-form')
      .addEventListener('submit', this._newItem.bind(this, 'expense'));
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
}

const app = new App();
