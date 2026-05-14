const STORAGE_KEY = 'maintenance_work_orders_v1_1';

const propertyMap = {
  '466': {
    propertyName: 'River Roads Manor',
    propertyAddress: '2380 Grand River Road, Jennings, MO',
  },
};

const sampleOrders = [
  {
    id: crypto.randomUUID(),
    workOrderId: 'WO-1001',
    propertyNumber: '466',
    propertyName: 'River Roads Manor',
    propertyAddress: '2380 Grand River Road, Jennings, MO',
    unitNumber: 'A-101',
    status: 'New',
    priority: 'Urgent',
    category: 'HVAC',
    subcategory: 'No Cooling',
    briefDescription: 'AC not cooling in bedroom',
    fullDescription: 'Tenant reported warm air since morning.',
    techNotes: 'Filter replacement needed.',
    assignedTechnician: 'Jordan M',
    createdDateTime: new Date().toLocaleString(),
    actualStartDateTime: '',
    actualFinishDateTime: '',
    totalLaborHours: '',
    photoName: 'ac-unit.jpg',
const orders = [
  {
    id: crypto.randomUUID(),
    title: 'AC not cooling in bedroom',
    apartment: 'A-101',
    priority: 'emergency',
    notes: ['Tenant reported warm air since morning.', 'Checked filter; replacement needed.'],
    photoName: 'ac-unit.jpg',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Dishwasher leaking near door',
    apartment: 'C-305',
    priority: 'medium',
    notes: ['Leak appears during rinse cycle.'],
    photoName: 'dishwasher-leak.png',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Hallway light flickering',
    apartment: 'B-210',
    priority: 'low',
    notes: ['Likely bulb issue; backup ballast in truck.'],
    photoName: 'No photo uploaded',
    completed: false,
  },
];

const form = document.getElementById('workOrderForm');
const ordersList = document.getElementById('ordersList');
const startWorkBtn = document.getElementById('startWorkBtn');
const completeWorkBtn = document.getElementById('completeWorkBtn');
const clearBtn = document.getElementById('clearBtn');
const propertyNumberInput = document.getElementById('propertyNumber');

let orders = [];

// localStorage logic: load saved orders first; if empty, use starter fake data.
function loadOrders() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    orders = JSON.parse(raw);
    return;
  }

  orders = sampleOrders;
  saveOrders();
}

// localStorage logic: save the full work-order array any time data changes.
function saveOrders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function getFormData() {
  const formData = new FormData(form);
  const photoFile = formData.get('photo');
  return {
    id: formData.get('recordId') || crypto.randomUUID(),
    workOrderId: formData.get('workOrderId').toString().trim(),
    propertyNumber: formData.get('propertyNumber').toString().trim(),
    propertyName: formData.get('propertyName').toString().trim(),
    propertyAddress: formData.get('propertyAddress').toString().trim(),
    unitNumber: formData.get('unitNumber').toString().trim(),
    status: formData.get('status').toString(),
    priority: formData.get('priority').toString(),
    category: formData.get('category').toString().trim(),
    subcategory: formData.get('subcategory').toString().trim(),
    briefDescription: formData.get('briefDescription').toString().trim(),
    fullDescription: formData.get('fullDescription').toString().trim(),
    techNotes: formData.get('techNotes').toString().trim(),
    assignedTechnician: formData.get('assignedTechnician').toString().trim(),
    createdDateTime: formData.get('createdDateTime').toString().trim() || new Date().toLocaleString(),
    actualStartDateTime: formData.get('actualStartDateTime').toString().trim(),
    actualFinishDateTime: formData.get('actualFinishDateTime').toString().trim(),
    totalLaborHours: formData.get('totalLaborHours').toString().trim(),
    photoName: photoFile && photoFile.name ? photoFile.name : 'No photo uploaded',
  };
}

function fillForm(order) {
  Object.keys(order).forEach((key) => {
    const input = document.getElementById(key);
    if (input) input.value = order[key] ?? '';
  });
}

function clearForm() {
  form.reset();
  document.getElementById('recordId').value = '';
  document.getElementById('createdDateTime').value = '';
  document.getElementById('actualStartDateTime').value = '';
  document.getElementById('actualFinishDateTime').value = '';
  document.getElementById('totalLaborHours').value = '';
  document.getElementById('status').value = 'New';
  document.getElementById('priority').value = 'Scheduled';
}

function renderOrders() {
  ordersList.innerHTML = '';

  if (orders.length === 0) {
    ordersList.innerHTML = '<p class="empty-state">No saved work orders yet.</p>';
    return;
  }

  orders.forEach((order) => {
    const card = document.createElement('article');
    card.className = 'order-card';
    card.innerHTML = `
      <div class="order-card__top">
        <h3 class="order-title">${order.workOrderId} · Unit ${order.unitNumber}</h3>
      </div>
      <p class="order-line"><strong>Status:</strong> ${order.status}</p>
      <p class="order-line"><strong>Priority:</strong> ${order.priority}</p>
      <p class="order-line"><strong>Brief:</strong> ${order.briefDescription}</p>
      <p class="order-line"><strong>Tech:</strong> ${order.assignedTechnician}</p>
      <p class="order-line"><strong>Created:</strong> ${order.createdDateTime}</p>
      <div class="button-row">
        <button class="btn" data-action="open">Open / Edit</button>
        <button class="btn" data-action="delete">Delete</button>
      </div>
    `;

    card.querySelector('[data-action="open"]').addEventListener('click', () => fillForm(order));
    card.querySelector('[data-action="delete"]').addEventListener('click', () => {
      orders = orders.filter((item) => item.id !== order.id);
      saveOrders();
      renderOrders();
      if (document.getElementById('recordId').value === order.id) clearForm();
    });

    ordersList.appendChild(card);
  });
}

// property autofill logic: when property #466 is entered, fill name and address automatically.
propertyNumberInput.addEventListener('input', () => {
  const value = propertyNumberInput.value.trim();
  const match = propertyMap[value];
  if (!match) return;
  document.getElementById('propertyName').value = match.propertyName;
  document.getElementById('propertyAddress').value = match.propertyAddress;
});

// time tracking logic: Start Work records the current timestamp as actual start time.
startWorkBtn.addEventListener('click', () => {
  document.getElementById('actualStartDateTime').value = new Date().toLocaleString();
  document.getElementById('status').value = 'In Progress';
});

// time tracking logic: Complete Work sets finish timestamp, status, and total labor hours.
completeWorkBtn.addEventListener('click', () => {
  const finish = new Date();
  document.getElementById('actualFinishDateTime').value = finish.toLocaleString();
  document.getElementById('status').value = 'Completed';

  const startRaw = document.getElementById('actualStartDateTime').value;
  if (!startRaw) return;
  const start = new Date(startRaw);
  const diffHours = (finish - start) / 3600000;
  if (diffHours >= 0) {
    document.getElementById('totalLaborHours').value = diffHours.toFixed(2);
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const record = getFormData();

  const existingIndex = orders.findIndex((order) => order.id === record.id);
  if (existingIndex >= 0) {
    orders[existingIndex] = { ...orders[existingIndex], ...record };
  } else {
    orders.unshift(record);
  }

  saveOrders();
  renderOrders();
  clearForm();
});

clearBtn.addEventListener('click', clearForm);

loadOrders();
renderOrders();
clearForm();
const orderTemplate = document.getElementById('orderTemplate');

function prettyPriority(priority) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function renderOrders() {
  const activeOrders = orders.filter((order) => !order.completed);
  ordersList.innerHTML = '';

  if (activeOrders.length === 0) {
    ordersList.innerHTML = '<p class="empty-state">No active work orders. Great job!</p>';
    return;
  }

  activeOrders.forEach((order) => {
    const fragment = orderTemplate.content.cloneNode(true);

    const card = fragment.querySelector('.order-card');
    card.dataset.orderId = order.id;

    fragment.querySelector('.order-title').textContent = order.title;
    fragment.querySelector('.order-apartment').textContent = `Apartment: ${order.apartment}`;
    fragment.querySelector('.order-notes').textContent =
      `Latest note: ${order.notes[order.notes.length - 1] || 'No notes yet.'}`;
    fragment.querySelector('.order-photo').textContent = `Photo: ${order.photoName}`;

    const badge = fragment.querySelector('.priority-badge');
    badge.textContent = prettyPriority(order.priority);
    badge.classList.add(`priority-${order.priority}`);

    const notesList = fragment.querySelector('.notes-list');
    order.notes.forEach((note) => {
      const li = document.createElement('li');
      li.textContent = note;
      notesList.appendChild(li);
    });

    const noteForm = fragment.querySelector('.quick-note-form');
    const noteInput = fragment.querySelector('.quick-note-input');
    noteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = noteInput.value.trim();
      if (!value) return;
      order.notes.push(value);
      renderOrders();
    });

    const completeBtn = fragment.querySelector('.complete-btn');
    completeBtn.addEventListener('click', () => {
      order.completed = true;
      renderOrders();
    });

    ordersList.appendChild(fragment);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  const photoFile = formData.get('photo');

  orders.unshift({
    id: crypto.randomUUID(),
    title: formData.get('title').toString().trim(),
    apartment: formData.get('apartment').toString().trim(),
    priority: formData.get('priority').toString(),
    notes: [formData.get('notes').toString().trim() || 'No notes added.'],
    photoName: photoFile && photoFile.name ? photoFile.name : 'No photo uploaded',
    completed: false,
  });

  form.reset();
  document.getElementById('priority').value = 'medium';
  renderOrders();
});

renderOrders();
