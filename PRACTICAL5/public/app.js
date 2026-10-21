// Practical 5 Client-side Logic & Validation Inspector
const API_BASE = '/tasks';

// DOM Elements
const taskList = document.getElementById('taskList');
const createTaskForm = document.getElementById('createTaskForm');
const totalTasksCount = document.getElementById('totalTasksCount');
const pendingTasksCount = document.getElementById('pendingTasksCount');
const completedTasksCount = document.getElementById('completedTasksCount');
const highPriorityCount = document.getElementById('highPriorityCount');
const dbStatusText = document.getElementById('dbStatusText');
const dbStatusPill = document.getElementById('dbStatusPill');

// Inspector Elements
const responseStatusBadge = document.getElementById('responseStatusBadge');
const responseMethod = document.getElementById('responseMethod');
const responseUrl = document.getElementById('responseUrl');
const responseTime = document.getElementById('responseTime');
const responseBody = document.getElementById('responseBody');

// Filter Elements
const searchInput = document.getElementById('searchInput');
const priorityFilter = document.getElementById('priorityFilter');
const statusFilter = document.getElementById('statusFilter');
const btnRefreshTasks = document.getElementById('btnRefreshTasks');

// Edit Modal Elements
const editModal = document.getElementById('editModal');
const editTaskForm = document.getElementById('editTaskForm');
const editTaskId = document.getElementById('editTaskId');
const editTaskTitle = document.getElementById('editTaskTitle');
const editTaskDescription = document.getElementById('editTaskDescription');
const editTaskPriority = document.getElementById('editTaskPriority');
const editTaskCompleted = document.getElementById('editTaskCompleted');
const btnCloseEditModal = document.getElementById('btnCloseEditModal');
const btnCancelEdit = document.getElementById('btnCancelEdit');

// Validation Lab Buttons
const btnTestMissingTitle = document.getElementById('btnTestMissingTitle');
const btnTestInvalidEnum = document.getElementById('btnTestInvalidEnum');
const btnTestTrimHook = document.getElementById('btnTestTrimHook');
const btnTest404 = document.getElementById('btnTest404');
const btnTestCastError = document.getElementById('btnTestCastError');

// Log API response into the real-time terminal inspector
function inspectResponse(method, url, status, duration, data) {
  responseMethod.textContent = method;
  responseUrl.textContent = url;
  responseTime.textContent = `${duration} ms`;
  responseStatusBadge.textContent = `${status} ${status === 200 || status === 201 ? 'OK' : status === 400 ? 'BAD REQUEST' : status === 404 ? 'NOT FOUND' : 'ERROR'}`;

  responseStatusBadge.className = 'status-code-badge';
  if (status >= 200 && status < 300) {
    responseStatusBadge.classList.add('status-200');
  } else if (status === 400) {
    responseStatusBadge.classList.add('status-400');
  } else if (status === 404) {
    responseStatusBadge.classList.add('status-404');
  } else {
    responseStatusBadge.classList.add('status-500');
  }

  responseBody.textContent = JSON.stringify(data, null, 2);
}

// Wrapper to make API calls with performance measurement
async function apiRequest(url, options = {}) {
  const start = performance.now();
  const method = options.method || 'GET';
  try {
    const res = await fetch(url, options);
    const duration = Math.round(performance.now() - start);
    const data = await res.json();
    inspectResponse(method, url, res.status, duration, data);
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    inspectResponse(method, url, 500, duration, { error: 'NetworkError', message: err.message });
    return { ok: false, status: 500, data: { error: err.message } };
  }
}

// Check MongoDB connection health
async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    if (res.ok && data.status === 'OK') {
      dbStatusText.textContent = 'MongoDB Connected';
      dbStatusPill.style.display = 'inline-flex';
    }
  } catch (err) {
    dbStatusText.textContent = 'DB Offline';
    dbStatusPill.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    dbStatusPill.style.color = '#ef4444';
  }
}

// Load tasks from API with filters
async function loadTasks() {
  let url = `${API_BASE}?`;
  const params = new URLSearchParams();

  if (priorityFilter.value) params.append('priority', priorityFilter.value);
  if (statusFilter.value) params.append('completed', statusFilter.value);
  if (searchInput.value.trim()) params.append('search', searchInput.value.trim());

  url += params.toString();

  const { ok, data } = await apiRequest(url, { method: 'GET' });

  if (ok && Array.isArray(data.data)) {
    renderTasks(data.data);
    updateMetrics(data.data);
  } else {
    taskList.innerHTML = `<div class="empty-state">Unable to load tasks from MongoDB.</div>`;
  }
}

// Render task list in UI
function renderTasks(tasks) {
  if (tasks.length === 0) {
    taskList.innerHTML = `<div class="empty-state">No tasks found in MongoDB. Create one or reset filters!</div>`;
    return;
  }

  taskList.innerHTML = tasks.map(task => {
    const pClass = `p-${task.priority || 'medium'}`;
    const dateStr = new Date(task.createdAt).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return `
      <div class="task-item ${task.completed ? 'is-completed' : ''}" data-id="${task._id}">
        <div class="task-left">
          <input 
            type="checkbox" 
            class="task-toggle" 
            ${task.completed ? 'checked' : ''} 
            onchange="toggleTaskStatus('${task._id}', this.checked)"
          >
          <div class="task-content">
            <div class="task-top-line">
              <span class="task-text-title">${escapeHtml(task.title)}</span>
              <span class="p-badge ${pClass}">${task.priority}</span>
            </div>
            ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}
            <div class="task-meta">
              <span class="task-id">ID: ${task._id.slice(-6)}</span>
              <span>📅 ${dateStr}</span>
            </div>
          </div>
        </div>
        <div class="task-actions">
          <button class="btn-action edit" onclick="openEditModal('${task._id}')" title="Edit Task">✏️</button>
          <button class="btn-action delete" onclick="deleteTask('${task._id}')" title="Delete Task">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

// Update Metric Cards
function updateMetrics(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const high = tasks.filter(t => t.priority === 'high').length;

  totalTasksCount.textContent = total;
  pendingTasksCount.textContent = pending;
  completedTasksCount.textContent = completed;
  highPriorityCount.textContent = high;
}

// Handle Task Creation
createTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const priority = document.getElementById('taskPriority').value;
  const completed = document.getElementById('taskCompleted').checked;

  const payload = { title, description, priority, completed };

  const { ok } = await apiRequest(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (ok) {
    createTaskForm.reset();
    document.getElementById('taskPriority').value = 'medium';
    loadTasks();
  }
});

// Toggle Task Completed
async function toggleTaskStatus(id, completed) {
  const { ok } = await apiRequest(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });

  if (ok) {
    loadTasks();
  }
}

// Delete Task
async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task from MongoDB?')) return;

  const { ok } = await apiRequest(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });

  if (ok) {
    loadTasks();
  }
}

// Edit Modal Functions
async function openEditModal(id) {
  const { ok, data } = await apiRequest(`${API_BASE}/${id}`, { method: 'GET' });
  if (ok && data.data) {
    const task = data.data;
    editTaskId.value = task._id;
    editTaskTitle.value = task.title;
    editTaskDescription.value = task.description || '';
    editTaskPriority.value = task.priority || 'medium';
    editTaskCompleted.checked = Boolean(task.completed);
    editModal.classList.add('active');
  }
}

function closeEditModal() {
  editModal.classList.remove('active');
}

btnCloseEditModal.addEventListener('click', closeEditModal);
btnCancelEdit.addEventListener('click', closeEditModal);

editTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = editTaskId.value;
  const payload = {
    title: editTaskTitle.value,
    description: editTaskDescription.value,
    priority: editTaskPriority.value,
    completed: editTaskCompleted.checked
  };

  const { ok } = await apiRequest(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (ok) {
    closeEditModal();
    loadTasks();
  }
});

// ==========================================
// VALIDATION LAB TEST ACTIONS
// ==========================================

// 1. Missing Title Test (Schema required constraint violation)
btnTestMissingTitle.addEventListener('click', async () => {
  await apiRequest(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description: 'Attempting creation without required title',
      priority: 'low'
    })
  });
});

// 2. Invalid Priority Enum Test (Schema enum constraint violation)
btnTestInvalidEnum.addEventListener('click', async () => {
  await apiRequest(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Task with invalid priority enum',
      priority: 'urgent' // Invalid value
    })
  });
});

// 3. Pre-save Trim Hook Test
btnTestTrimHook.addEventListener('click', async () => {
  const { ok } = await apiRequest(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: '    Whitespace Trim Hook Verified    ',
      description: 'Check how leading and trailing spaces were automatically stripped',
      priority: 'medium'
    })
  });

  if (ok) {
    loadTasks();
  }
});

// 4. Non-existent 404 ID Test
btnTest404.addEventListener('click', async () => {
  const dummyValidId = '507f1f77bcf86cd799439011';
  await apiRequest(`${API_BASE}/${dummyValidId}`, {
    method: 'GET'
  });
});

// 5. Malformed CastError Test
btnTestCastError.addEventListener('click', async () => {
  await apiRequest(`${API_BASE}/invalid-object-id-12345`, {
    method: 'GET'
  });
});

// Filter & Search Handlers
searchInput.addEventListener('input', debounce(loadTasks, 300));
priorityFilter.addEventListener('change', loadTasks);
statusFilter.addEventListener('change', loadTasks);
btnRefreshTasks.addEventListener('click', loadTasks);

// Utilities
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Initial load
checkHealth();
loadTasks();
