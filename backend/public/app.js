// ==========================================
// AGROLEDGER APPLICATION STATE & INIT
// ==========================================

const state = {
  user: null,
  activeView: 'dashboard-view',
  crops: [],
  expenses: [],
  incomes: [],
  charts: {
    cropPerformance: null,
    expenseCategory: null,
    incomeSource: null
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Set current date in header
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', dateOptions);

  // Initialize Router / Nav Handlers
  initNavigation();
  
  // Check auth session
  checkAuth();

  // Setup form submission listeners
  setupFormListeners();
});

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-xmark';
  if (type === 'info') icon = 'fa-circle-info';
  
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Remove toast from DOM after animation completes
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// ==========================================
// NAVIGATION & PAGE ROUTING
// ==========================================
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-target');
      switchView(targetView);
    });
  });

  // Auth toggle links
  document.getElementById('switch-to-signup').addEventListener('click', () => {
    document.getElementById('login-card').classList.add('hidden');
    document.getElementById('signup-card').classList.remove('hidden');
  });

  document.getElementById('switch-to-login').addEventListener('click', () => {
    document.getElementById('signup-card').classList.add('hidden');
    document.getElementById('login-card').classList.remove('hidden');
  });

  // Logout button
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  // Demo Data loader button
  document.getElementById('demo-data-btn').addEventListener('click', loadDemoData);

  // Table filter change listeners
  document.getElementById('expense-crop-filter').addEventListener('change', filterExpenses);
  document.getElementById('expense-category-filter').addEventListener('change', filterExpenses);
  document.getElementById('income-crop-filter').addEventListener('change', filterIncomes);
  document.getElementById('income-source-filter').addEventListener('change', filterIncomes);
}

function switchView(viewId) {
  state.activeView = viewId;
  
  // Update nav menu active states
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.getAttribute('data-target') === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Hide all panels, show target
  const panels = document.querySelectorAll('.view-panel');
  panels.forEach(panel => {
    if (panel.id === viewId) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  });

  // Update header text based on view
  const title = document.getElementById('view-title');
  const subtitle = document.getElementById('view-subtitle');

  if (viewId === 'dashboard-view') {
    title.textContent = 'Dashboard';
    subtitle.textContent = 'Overview of your farming finances';
    updateDashboard();
  } else if (viewId === 'crops-view') {
    title.textContent = 'Crops / Plantings';
    subtitle.textContent = 'Track and manage crop growth cycles';
    renderCrops();
  } else if (viewId === 'expenses-view') {
    title.textContent = 'Expenses Log';
    subtitle.textContent = 'View and log your input and labor expenses';
    renderExpenses();
  } else if (viewId === 'income-view') {
    title.textContent = 'Income Log';
    subtitle.textContent = 'Log revenues from crop sales and subsidies';
    renderIncomes();
  }
}

// ==========================================
// API REQUEST WRAPPER
// ==========================================
async function apiRequest(url, options = {}) {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json'
    };
    
    options.headers = { ...defaultHeaders, ...options.headers };
    
    // Convert body to string if it's an object
    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
    
    const response = await fetch(url, options);
    
    // Handle unauthorized redirects
    if (response.status === 401 && !url.includes('/api/user/login') && !url.includes('/api/user/signup')) {
      showToast('Session expired. Please log in again.', 'error');
      setLoggedOutState();
      return null;
    }
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.errors?.join(', ') || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    showToast(error.message, 'error');
    console.error(`API Error on ${url}:`, error);
    return null;
  }
}

// ==========================================
// AUTHENTICATION LOGIC
// ==========================================
async function checkAuth() {
  const user = await apiRequest('/api/user/');
  if (user) {
    setLoggedInState(user);
    loadAppData();
  } else {
    setLoggedOutState();
  }
}

function setLoggedInState(user) {
  state.user = user;
  document.getElementById('user-display-name').textContent = `${user.firstname} ${user.lastname}`;
  document.getElementById('user-display-email').textContent = user.email;
  
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('app-layout').classList.remove('hidden');
  
  switchView('dashboard-view');
}

function setLoggedOutState() {
  state.user = null;
  document.getElementById('app-layout').classList.add('hidden');
  document.getElementById('auth-section').classList.remove('hidden');
}

async function handleLogout() {
  const result = await apiRequest('/api/user/logout', { method: 'POST' });
  if (result) {
    showToast('Logged out successfully');
    setLoggedOutState();
  }
}

// ==========================================
// LOAD APP DATA
// ==========================================
async function loadAppData() {
  const [crops, expenses, incomes] = await Promise.all([
    apiRequest('/api/crop'),
    apiRequest('/api/expense'),
    apiRequest('/api/income')
  ]);

  state.crops = crops || [];
  state.expenses = expenses || [];
  state.incomes = incomes || [];

  populateFilters();
  updateDashboard();
}

function populateFilters() {
  const expenseCropFilter = document.getElementById('expense-crop-filter');
  const incomeCropFilter = document.getElementById('income-crop-filter');
  const expenseModalSelect = document.getElementById('expense-crop-id');
  const incomeModalSelect = document.getElementById('income-crop-id');

  // Reset to default
  expenseCropFilter.innerHTML = '<option value="">All Crops</option>';
  incomeCropFilter.innerHTML = '<option value="">All Crops</option>';
  expenseModalSelect.innerHTML = '<option value="" disabled selected>-- Choose crop cycle --</option>';
  incomeModalSelect.innerHTML = '<option value="" disabled selected>-- Choose crop cycle --</option>';

  // Sort crops by name
  const sortedCrops = [...state.crops].sort((a, b) => a.cropName.localeCompare(b.cropName));

  sortedCrops.forEach(crop => {
    const statusText = crop.status ? ` (${crop.status})` : '';
    const optionHTML = `<option value="${crop._id}">${crop.cropName}${statusText}</option>`;
    
    expenseCropFilter.insertAdjacentHTML('beforeend', optionHTML);
    incomeCropFilter.insertAdjacentHTML('beforeend', optionHTML);
    expenseModalSelect.insertAdjacentHTML('beforeend', optionHTML);
    incomeModalSelect.insertAdjacentHTML('beforeend', optionHTML);
  });
}

// ==========================================
// DASHBOARD & ANALYTICS UPDATES
// ==========================================
function updateDashboard() {
  // 1. Calculate KPI Metrics
  const totalIncome = state.incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExpenses = state.expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const netBalance = totalIncome - totalExpenses;
  const activeCropCount = state.crops.filter(crop => crop.status === 'growing').length;

  document.getElementById('kpi-total-income').textContent = formatCurrency(totalIncome);
  document.getElementById('kpi-total-expenses').textContent = formatCurrency(totalExpenses);
  
  const balanceEl = document.getElementById('kpi-net-balance');
  balanceEl.textContent = formatCurrency(netBalance);
  balanceEl.className = netBalance >= 0 ? 'text-success' : 'text-danger';
  
  document.getElementById('kpi-crop-count').textContent = activeCropCount;

  // 2. Render Recent activity list
  renderRecentActivity();

  // 3. Render Dashboard Charts
  renderCharts(totalIncome, totalExpenses);
}

function renderRecentActivity() {
  const tbody = document.getElementById('recent-transactions-tbody');
  tbody.innerHTML = '';

  // Mix expenses and incomes, sort by date desc
  const activities = [
    ...state.expenses.map(e => ({ ...e, type: 'expense' })),
    ...state.incomes.map(i => ({ ...i, type: 'income' }))
  ].sort((a, b) => new Date(b.expenseDate || b.incomeDate) - new Date(a.expenseDate || a.incomeDate));

  const recent = activities.slice(0, 5);

  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No transactions recorded yet</td></tr>';
    return;
  }

  recent.forEach(act => {
    const date = new Date(act.expenseDate || act.incomeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const isExpense = act.type === 'expense';
    const typeHTML = `<span class="badge ${isExpense ? 'badge-failed' : 'badge-growing'}">${act.type.toUpperCase()}</span>`;
    const cropName = act.cropId?.cropName || 'Unknown Crop';
    const details = isExpense ? act.category : act.source;
    const amountHTML = `<span class="font-bold ${isExpense ? 'text-danger' : 'text-success'}">${isExpense ? '-' : '+'}${formatCurrency(act.amount)}</span>`;

    const row = `
      <tr>
        <td>${date}</td>
        <td>${typeHTML}</td>
        <td>${cropName}</td>
        <td><span class="text-muted">${details}</span></td>
        <td>${amountHTML}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

function renderCharts(totalIncome, totalExpenses) {
  // Destroy existing charts to prevent hover glitching
  Object.keys(state.charts).forEach(key => {
    if (state.charts[key]) {
      state.charts[key].destroy();
    }
  });

  // CHART 1: Expense by Category
  const expenseCats = {};
  state.expenses.forEach(e => {
    expenseCats[e.category] = (expenseCats[e.category] || 0) + e.amount;
  });
  
  const expLabels = Object.keys(expenseCats).map(c => c.charAt(0).toUpperCase() + c.slice(1));
  const expData = Object.values(expenseCats);

  const ctxCategory = document.getElementById('expenseCategoryChart').getContext('2d');
  state.charts.expenseCategory = new Chart(ctxCategory, {
    type: 'doughnut',
    data: {
      labels: expLabels.length ? expLabels : ['No Expenses'],
      datasets: [{
        data: expData.length ? expData : [1],
        backgroundColor: [
          '#ffd54f', // seed - yellow
          '#66bb6a', // fertilizer - green
          '#42a5f5', // labor - blue
          '#ab47bc', // machinery - purple
          '#ef5350', // pesticide - red
          '#e0e0e0'  // placeholder
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  // CHART 2: Income by Source
  const incomeSources = {};
  state.incomes.forEach(i => {
    incomeSources[i.source] = (incomeSources[i.source] || 0) + i.amount;
  });
  
  const incLabels = Object.keys(incomeSources).map(s => s.replace('_', ' ').toUpperCase());
  const incData = Object.values(incomeSources);

  const ctxSource = document.getElementById('incomeSourceChart').getContext('2d');
  state.charts.incomeSource = new Chart(ctxSource, {
    type: 'doughnut',
    data: {
      labels: incLabels.length ? incLabels : ['No Income'],
      datasets: [{
        data: incData.length ? incData : [1],
        backgroundColor: [
          '#2e7d32', // crop_sale - dark green
          '#ff8f00', // livestock - orange
          '#1565c0', // subsidy - blue
          '#00838f', // grant - teal
          '#e0e0e0'  // placeholder
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  // CHART 3: Income vs Expense per Crop
  const cropFinancials = {};
  
  // Seed crop names
  state.crops.forEach(c => {
    cropFinancials[c._id] = { name: c.cropName, income: 0, expense: 0 };
  });

  state.expenses.forEach(e => {
    const cropId = e.cropId?._id || e.cropId;
    if (cropFinancials[cropId]) {
      cropFinancials[cropId].expense += e.amount;
    }
  });

  state.incomes.forEach(i => {
    const cropId = i.cropId?._id || i.cropId;
    if (cropFinancials[cropId]) {
      cropFinancials[cropId].income += i.amount;
    }
  });

  const cropNames = Object.values(cropFinancials).map(cf => cf.name);
  const cropInc = Object.values(cropFinancials).map(cf => cf.income);
  const cropExp = Object.values(cropFinancials).map(cf => cf.expense);

  const ctxPerformance = document.getElementById('cropPerformanceChart').getContext('2d');
  state.charts.cropPerformance = new Chart(ctxPerformance, {
    type: 'bar',
    data: {
      labels: cropNames.length ? cropNames : ['No Crops Added'],
      datasets: [
        {
          label: 'Revenue',
          data: cropInc.length ? cropInc : [0],
          backgroundColor: 'rgba(46, 125, 50, 0.85)', // primary theme green
          borderRadius: 6
        },
        {
          label: 'Expenses',
          data: cropExp.length ? cropExp : [0],
          backgroundColor: 'rgba(239, 83, 80, 0.85)', // custom red
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: {
          grid: { display: false }
        }
      },
      plugins: {
        legend: { position: 'top' }
      }
    }
  });
}

// ==========================================
// RENDER DATA VIEWS
// ==========================================
function renderCrops() {
  const tbody = document.getElementById('crops-tbody');
  tbody.innerHTML = '';

  if (state.crops.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No crops added yet. Start by creating a crop cycle!</td></tr>';
    return;
  }

  // Calculate totals per crop
  const cropTotals = {};
  state.crops.forEach(c => {
    cropTotals[c._id] = { income: 0, expense: 0 };
  });
  state.expenses.forEach(e => {
    const cid = e.cropId?._id || e.cropId;
    if (cropTotals[cid]) cropTotals[cid].expense += e.amount;
  });
  state.incomes.forEach(i => {
    const cid = i.cropId?._id || i.cropId;
    if (cropTotals[cid]) cropTotals[cid].income += i.amount;
  });

  state.crops.forEach(crop => {
    const pDate = new Date(crop.plantingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const hDate = crop.harvestDate ? new Date(crop.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Ongoing';
    const badgeClass = `badge-${crop.status || 'growing'}`;
    const statusLabel = (crop.status || 'growing').toUpperCase();

    const financials = cropTotals[crop._id] || { income: 0, expense: 0 };
    const netProfit = financials.income - financials.expense;
    const netColor = netProfit >= 0 ? 'text-success' : 'text-danger';

    // Dropdown to update status dynamically
    const row = `
      <tr>
        <td class="font-bold">${crop.cropName}</td>
        <td>${pDate}</td>
        <td>${hDate}</td>
        <td><span class="badge ${badgeClass}">${statusLabel}</span></td>
        <td>
          <div class="badge-financial">
            <span class="text-success" title="Revenue">+${formatCurrency(financials.income)}</span> / 
            <span class="text-danger" title="Expenses">-${formatCurrency(financials.expense)}</span> = 
            <span class="${netColor} font-bold" title="Net profit/loss">${formatCurrency(netProfit)}</span>
          </div>
        </td>
        <td>
          <div class="actions-cell">
            <select class="form-select form-select-sm" style="padding: 4px 8px; font-size: 0.75rem; width: 120px;" onchange="updateCropStatus('${crop._id}', this.value)">
              <option value="growing" ${crop.status === 'growing' ? 'selected' : ''}>Growing</option>
              <option value="harvested" ${crop.status === 'harvested' ? 'selected' : ''}>Harvested</option>
              <option value="failed" ${crop.status === 'failed' ? 'selected' : ''}>Failed</option>
            </select>
          </div>
        </td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

async function updateCropStatus(cropId, newStatus) {
  // Since update status endpoint isn't fully set up in the template, we'll patch it or mock it if needed.
  // Wait, let's look at crop.routes.js: it does not have a status update endpoint.
  // Let's add custom handler or handle it beautifully. We'll add status patch support in our backend controllers.
  const response = await apiRequest(`/api/crop/${cropId}/status`, {
    method: 'PATCH',
    body: { status: newStatus }
  });

  if (response) {
    showToast('Crop status updated successfully!');
    // Update local state
    const crop = state.crops.find(c => c._id === cropId);
    if (crop) crop.status = newStatus;
    
    // Refresh
    if (state.activeView === 'crops-view') renderCrops();
    else if (state.activeView === 'dashboard-view') updateDashboard();
  }
}

function renderExpenses() {
  const tbody = document.getElementById('expenses-tbody');
  tbody.innerHTML = '';

  const cropFilterVal = document.getElementById('expense-crop-filter').value;
  const catFilterVal = document.getElementById('expense-category-filter').value;

  let filtered = state.expenses;
  if (cropFilterVal) {
    filtered = filtered.filter(e => {
      const cid = e.cropId?._id || e.cropId;
      return cid === cropFilterVal;
    });
  }
  if (catFilterVal) {
    filtered = filtered.filter(e => e.category === catFilterVal);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No expenses matching filters</td></tr>';
    return;
  }

  filtered.forEach(exp => {
    const date = new Date(exp.expenseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const cropName = exp.cropId?.cropName || 'Unknown Crop';
    const categoryLabel = exp.category.charAt(0).toUpperCase() + exp.category.slice(1);
    
    const row = `
      <tr>
        <td>${date}</td>
        <td class="font-bold">${cropName}</td>
        <td><span class="badge badge-growing">${categoryLabel}</span></td>
        <td>${exp.description}</td>
        <td class="text-danger font-bold">-${formatCurrency(exp.amount)}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

function filterExpenses() {
  renderExpenses();
}

function renderIncomes() {
  const tbody = document.getElementById('income-tbody');
  tbody.innerHTML = '';

  const cropFilterVal = document.getElementById('income-crop-filter').value;
  const sourceFilterVal = document.getElementById('income-source-filter').value;

  let filtered = state.incomes;
  if (cropFilterVal) {
    filtered = filtered.filter(i => {
      const cid = i.cropId?._id || i.cropId;
      return cid === cropFilterVal;
    });
  }
  if (sourceFilterVal) {
    filtered = filtered.filter(i => i.source === sourceFilterVal);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No incomes matching filters</td></tr>';
    return;
  }

  filtered.forEach(inc => {
    const date = new Date(inc.incomeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const cropName = inc.cropId?.cropName || 'Unknown Crop';
    const sourceLabel = inc.source.replace('_', ' ').toUpperCase();
    const qty = inc.quantity_sold || '-';
    const unitPrice = inc.uintPrice || inc.unitPrice ? formatCurrency(inc.uintPrice || inc.unitPrice) : '-';

    const row = `
      <tr>
        <td>${date}</td>
        <td class="font-bold">${cropName}</td>
        <td><span class="badge badge-harvested">${sourceLabel}</span></td>
        <td>${qty}</td>
        <td>${unitPrice}</td>
        <td class="text-success font-bold">+${formatCurrency(inc.amount)}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

function filterIncomes() {
  renderIncomes();
}

// ==========================================
// FORM SUBMISSIONS
// ==========================================
function setupFormListeners() {
  // Login Form
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const result = await apiRequest('/api/user/login', {
      method: 'POST',
      body: { email, password }
    });

    if (result) {
      showToast('Login successful!');
      checkAuth();
    }
  });

  // Signup Form
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstname = document.getElementById('signup-firstname').value;
    const lastname = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    const result = await apiRequest('/api/user/signup', {
      method: 'POST',
      body: { firstname, lastname, email, password }
    });

    if (result) {
      showToast('Signup successful! Please log in.');
      document.getElementById('signup-card').classList.add('hidden');
      document.getElementById('login-card').classList.remove('hidden');
    }
  });

  // Add Crop Form
  document.getElementById('add-crop-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cropName = document.getElementById('crop-name').value;
    const plantingDate = document.getElementById('crop-planting-date').value;
    const harvestDate = document.getElementById('crop-harvest-date').value || undefined;
    const status = document.getElementById('crop-status').value;

    const crop = await apiRequest('/api/crop', {
      method: 'POST',
      body: { cropName, plantingDate, harvestDate, status }
    });

    if (crop) {
      showToast('New crop cycle registered successfully!');
      closeModal('add-crop-modal');
      e.target.reset();
      
      // Reload App Data to fetch newest database info
      await loadAppData();
      switchView('crops-view');
    }
  });

  // Add Expense Form
  document.getElementById('add-expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cropId = document.getElementById('expense-crop-id').value;
    const category = document.getElementById('expense-category').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const expenseDate = document.getElementById('expense-date').value;
    const description = document.getElementById('expense-description').value;

    const expense = await apiRequest('/api/expense', {
      method: 'POST',
      body: { cropId, category, amount, expenseDate, description }
    });

    if (expense) {
      showToast('Expense recorded successfully!');
      closeModal('add-expense-modal');
      e.target.reset();
      
      await loadAppData();
      switchView('expenses-view');
    }
  });

  // Add Income Form
  document.getElementById('add-income-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cropId = document.getElementById('income-crop-id').value;
    const source = document.getElementById('income-source').value;
    const amount = parseFloat(document.getElementById('income-amount').value);
    const incomeDate = document.getElementById('income-date').value;
    const quantity_sold = parseFloat(document.getElementById('income-quantity').value) || 0;
    const unitPrice = parseFloat(document.getElementById('income-unit-price').value) || undefined;

    const income = await apiRequest('/api/income', {
      method: 'POST',
      body: { cropId, source, amount, incomeDate, quantity_sold, unitPrice }
    });

    if (income) {
      showToast('Income recorded successfully!');
      closeModal('add-income-modal');
      e.target.reset();
      
      await loadAppData();
      switchView('income-view');
    }
  });
}

// ==========================================
// SEED MOCK/DEMO DATA
// ==========================================
async function loadDemoData() {
  if (state.crops.length > 0) {
    if (!confirm('This will load demo data. Your existing data will remain, but charts will look much richer. Continue?')) {
      return;
    }
  }

  showToast('Creating demo dataset, please wait...', 'info');

  const demoCrops = [
    { cropName: 'Premium Basmati Rice', plantingDate: '2026-03-01', status: 'growing' },
    { cropName: 'Red Vine Tomatoes', plantingDate: '2026-02-15', status: 'harvested', harvestDate: '2026-05-15' },
    { cropName: 'Organic Winter Wheat', plantingDate: '2025-11-10', status: 'harvested', harvestDate: '2026-04-20' },
    { cropName: 'Sweet Yellow Corn', plantingDate: '2026-04-10', status: 'growing' }
  ];

  const createdCrops = [];

  // 1. Create Crops
  for (const c of demoCrops) {
    const crop = await apiRequest('/api/crop', {
      method: 'POST',
      body: c
    });
    if (crop) {
      createdCrops.push(crop.crop);
    }
  }

  if (createdCrops.length < 4) {
    showToast('Failed to initialize demo crops.', 'error');
    return;
  }

  // Map crops
  const riceId = createdCrops[0]._id;
  const tomatoId = createdCrops[1]._id;
  const wheatId = createdCrops[2]._id;
  const cornId = createdCrops[3]._id;

  // 2. Create Expenses
  const demoExpenses = [
    { cropId: riceId, category: 'seed', amount: 350.00, expenseDate: '2026-03-02', description: 'Bought high-yield hybrid rice seeds' },
    { cropId: riceId, category: 'fertilizer', amount: 540.00, expenseDate: '2026-03-15', description: 'N-P-K fertilizer bags (5 units)' },
    { cropId: riceId, category: 'labor', amount: 800.00, expenseDate: '2026-04-01', description: 'Sowing and field leveling labor wages' },
    
    { cropId: tomatoId, category: 'seed', amount: 200.00, expenseDate: '2026-02-16', description: 'Plugs and seed trays for greenhouse tomatoes' },
    { cropId: tomatoId, category: 'pesticide', amount: 150.00, expenseDate: '2026-03-10', description: 'Organic insect sprays' },
    { cropId: tomatoId, category: 'machinery', amount: 400.00, expenseDate: '2026-04-05', description: 'Drip irrigation tubing rental and repairs' },
    { cropId: tomatoId, category: 'labor', amount: 650.00, expenseDate: '2026-05-10', description: 'Harvest labor contract payment' },

    { cropId: wheatId, category: 'seed', amount: 500.00, expenseDate: '2025-11-12', description: 'Winter wheat seed bulk purchase' },
    { cropId: wheatId, category: 'fertilizer', amount: 700.00, expenseDate: '2025-12-05', description: 'Superphosphate and potash fertilizer' },
    { cropId: wheatId, category: 'machinery', amount: 1200.00, expenseDate: '2026-04-18', description: 'Harvester lease fee for wheat cutting' },

    { cropId: cornId, category: 'seed', amount: 280.00, expenseDate: '2026-04-12', description: 'Sweet corn kernel bags' },
    { cropId: cornId, category: 'fertilizer', amount: 350.00, expenseDate: '2026-05-01', description: 'Nitrogen-rich top dressing fertilizer' }
  ];

  for (const e of demoExpenses) {
    await apiRequest('/api/expense', { method: 'POST', body: e });
  }

  // 3. Create Income
  const demoIncomes = [
    { cropId: tomatoId, source: 'crop_sale', amount: 2850.00, incomeDate: '2026-05-18', quantity_sold: 1200, unitPrice: 2.375 },
    { cropId: wheatId, source: 'crop_sale', amount: 6400.00, incomeDate: '2026-04-28', quantity_sold: 8000, unitPrice: 0.80 },
    { cropId: wheatId, source: 'subsidy', amount: 1200.00, incomeDate: '2026-05-02', quantity_sold: 0 },
    { cropId: riceId, source: 'grant', amount: 1500.00, incomeDate: '2026-03-20', quantity_sold: 0 }
  ];

  for (const i of demoIncomes) {
    await apiRequest('/api/income', { method: 'POST', body: i });
  }

  showToast('Demo dataset initialized successfully!');
  await loadAppData();
}

// ==========================================
// MODAL CONTROLLERS
// ==========================================
window.openModal = function(modalId) {
  document.getElementById(modalId).classList.add('active');
  
  // Set default date picker value to today
  const todayStr = new Date().toISOString().split('T')[0];
  if (modalId === 'add-crop-modal') {
    document.getElementById('crop-planting-date').value = todayStr;
  } else if (modalId === 'add-expense-modal') {
    document.getElementById('expense-date').value = todayStr;
  } else if (modalId === 'add-income-modal') {
    document.getElementById('income-date').value = todayStr;
  }
};

window.closeModal = function(modalId) {
  document.getElementById(modalId).classList.remove('active');
};

// Close modal if user clicks outside of it
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('active');
  }
};

// ==========================================
// FORMATTING HELPERS
// ==========================================
function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(val);
}
