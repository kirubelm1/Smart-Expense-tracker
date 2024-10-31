let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let totalBalance = JSON.parse(localStorage.getItem("totalBalance")) || 0;
const balanceEl = document.getElementById("balance");
const incomeSourceEl = document.getElementById("income-source");
const incomeAmountEl = document.getElementById("income-amount");
const expenseDescriptionEl = document.getElementById("expense-description");
const expenseAmountEl = document.getElementById("expense-amount");
const addIncomeBtn = document.getElementById("add-income");
const addExpenseBtn = document.getElementById("add-expense");
const historyListEl = document.getElementById("history-list");
const remindersEl = document.getElementById("reminders");
const reminderListEl = document.getElementById("reminder-list");
const reminderDescriptionEl = document.getElementById("reminder-description");
const reminderDateEl = document.getElementById("reminder-date");
const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

// Update balance display and save to localStorage
function updateBalance() {
    balanceEl.innerText = `$${totalBalance.toFixed(2)}`;
    localStorage.setItem("totalBalance", JSON.stringify(totalBalance));
}

// Add income to transactions
function addIncome() {
    const source = incomeSourceEl.value;
    const amount = parseFloat(incomeAmountEl.value);
    if (source && amount > 0) {
        totalBalance += amount;
        transactions.push({ type: 'income', source, amount, date: new Date().toLocaleDateString() });
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateBalance();
        displayHistory();
        clearInputs();
    }
}

// Add expense to transactions
function addExpense() {
    const description = expenseDescriptionEl.value;
    const amount = parseFloat(expenseAmountEl.value);
    if (description && amount > 0 && totalBalance >= amount) {
        totalBalance -= amount;
        transactions.push({ type: 'expense', description, amount, date: new Date().toLocaleDateString() });
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateBalance();
        displayHistory();
        displayReminders();
        clearInputs();
    } else if (totalBalance < amount) {
        alert("Insufficient balance");
    }
}

// Display transaction history
function displayHistory() {
    historyListEl.innerHTML = "";
    transactions.forEach(transaction => {
        const li = document.createElement("li");
        li.innerHTML = `${transaction.date} - ${transaction.type === 'income' ? transaction.source : transaction.description}: $${transaction.amount.toFixed(2)}`;
        historyListEl.appendChild(li);
    });
}

// Clear input fields
function clearInputs() {
    incomeSourceEl.value = '';
    incomeAmountEl.value = '';
    expenseDescriptionEl.value = '';
    expenseAmountEl.value = '';
}

// Display reminders
function displayReminders() {
    remindersEl.innerText = reminders.length > 0 ? "Upcoming payments to track" : "No upcoming payments";
    reminderListEl.innerHTML = '';
    reminders.forEach(reminder => {
        const li = document.createElement("li");
        li.innerText = `${reminder.date} - ${reminder.description}`;
        reminderListEl.appendChild(li);
    });
}

// Add reminder
function addReminder() {
    const description = reminderDescriptionEl.value;
    const date = reminderDateEl.value;
    if (description && date) {
        const reminder = { description, date };
        reminders.push(reminder);
        localStorage.setItem("reminders", JSON.stringify(reminders));
        displayReminders();
        reminderDescriptionEl.value = '';
        reminderDateEl.value = '';
    }
}

// Display monthly expenses chart
function displayChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyExpenses = Array(12).fill(0);
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            const month = new Date(transaction.date).getMonth();
            monthlyExpenses[month] += transaction.amount;
        }
    });
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Monthly Expenses',
                data: monthlyExpenses,
                backgroundColor: 'rgba(0, 112, 186, 0.2)',
                borderColor: '#0070ba',
                fill: true,
            }]
        }
    });
}

// Clear transaction history
function clearTransactionHistory() {
    transactions = [];
    localStorage.removeItem("transactions");
    totalBalance = 0;
    updateBalance();
    displayHistory();
}

// Event listeners
addIncomeBtn.addEventListener("click", addIncome);
addExpenseBtn.addEventListener("click", addExpense);
document.getElementById("clear-transaction-history").addEventListener("click", clearTransactionHistory);
document.getElementById("add-reminder").addEventListener("click", addReminder);

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    updateBalance();
    displayHistory();
    displayReminders();
    displayChart();
});
