// 1. Create classes with private and public properties, and public methods
// 2. Add event listeners with render DOM methods

// NOTES:
// In Vanilla JS you have to cause the DOM to 'render' each time we update the DOM (ie addIncome, addExpense)

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
    const totalBudgetEl = document.getElementById('budget-total');
    totalBudgetEl.innerHTML = this._totalAmount;
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

    const remaining = this._budgetLimit - this._totalAmount;

    budgetRemainingEl.innerHTML = remaining;
  }

  _render() {
    this._displayBudgetTotal();
    this._displayBudgetIncome();
    this._displayBudgetExpenses();
    this._displayBudgetRemaining();
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

const budget = new BudgetTracker();

const freelance = new Income('PAC Freelance', 2500);
budget.addIncome(freelance);

const oilChange = new Expense('Oil Change', 1200);
budget.addExpense(oilChange);

console.log(budget._expenses);
console.log(budget._income);
console.log(budget._totalAmount);
