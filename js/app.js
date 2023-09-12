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
    this._render();
  }

  addExpense(expense) {
    this._expenses.push(expense);
    this._totalAmount -= expense.amount;
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
      .addEventListener('submit', this._newIncome.bind(this));
    document
      .getElementById('expense-form')
      .addEventListener('submit', this._newExpense.bind(this));
  }

  _newIncome(e) {
    e.preventDefault();

    const name = document.getElementById('income-name');
    const amount = document.getElementById('income-amount');

    // Validate inputs
    if (name.value === '' || amount.value === '') {
      alert('Please fill in all fields');
      return;
    }

    const income = new Income(name.value, +amount.value);

    this._tracker.addIncome(income);

    name.value = '';
    amount.value = '';

    const collapseIncome = document.getElementById('collapse-income');
    const bsCollapse = new bootstrap.Collapse(collapseIncome, {
      toggle: true,
    });
  }

  _newExpense(e) {
    e.preventDefault();

    const name = document.getElementById('expense-name');
    const amount = document.getElementById('expense-amount');

    // Validate inputs
    if (name.value === '' || amount.value === '') {
      alert('Please fill in all fields');
      return;
    }

    const expense = new Expense(name.value, +amount.value);

    this._tracker.addExpense(expense);

    name.value = '';
    amount.value = '';

    const collapseExpense = document.getElementById('collapse-expense');
    const bsCollapse = new bootstrap.Collapse(collapseExpense, {
      toggle: true,
    });
  }
}

const app = new App();
