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
