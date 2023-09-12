class BudgetTracker {
  constructor() {
    this._budgetLimit = 4000;
    this._totalAmount = 0;
    this._income = [];
    this._expenses = [];
  }

  addIncome(income) {
    this._income.push(income);
    this._totalAmount += income.amount;
  }

  addExpense(expense) {
    this._expenses.push(expense);
    this._totalAmount -= expense.amount;
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

const oilChange = new Expense('Oil Change', 80);
budget.addExpense(oilChange);

console.log(budget._expenses);
console.log(budget._income);
console.log(budget._totalAmount);
