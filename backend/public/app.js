const API = '/api';
const TOKEN_KEY = 'api_token';
const USER_KEY = 'api_user';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  updateAuthUI(user);
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  updateAuthUI(null);
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

function updateAuthUI(user) {
  const status = $('#auth-status');
  const logoutBtn = $('#btn-logout');

  if (user) {
    status.textContent = `${user.name} (${user.role})`;
    status.className = `badge ${user.role === 'admin' ? 'badge-admin' : 'badge-success'}`;
    logoutBtn.classList.remove('hidden');
  } else {
    status.textContent = 'Não autenticado';
    status.className = 'badge badge-muted';
    logoutBtn.classList.add('hidden');
  }
}

function toast(message, type = 'success') {
  const el = $('#toast');
  el.textContent = message;
  el.className = `toast ${type}`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.add('hidden'), 3500);
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    const msg = data?.message || data?.errors?.map((e) => e.message).join(', ') || `Erro ${res.status}`;
    throw new Error(msg);
  }

  return { data, status: res.status };
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function renderTable(container, columns, rows, actions) {
  if (!rows.length) {
    container.innerHTML = '<p class="empty">Nenhum registro encontrado.</p>';
    return;
  }

  const head = columns.map((c) => `<th>${c.label}</th>`).join('') + (actions ? '<th>Ações</th>' : '');
  const body = rows
    .map((row) => {
      const cells = columns.map((c) => `<td>${c.render(row)}</td>`).join('');
      const act = actions ? `<td class="actions">${actions(row)}</td>` : '';
      return `<tr>${cells}${act}</tr>`;
    })
    .join('');

  container.innerHTML = `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function setupTabs() {
  $$('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.nav-item').forEach((b) => b.classList.remove('active'));
      $$('.tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      $(`#tab-${btn.dataset.tab}`).classList.add('active');

      const tab = btn.dataset.tab;
      if (tab === 'cars') loadCars();
      if (tab === 'motos') loadMotos();
      if (tab === 'marcas') loadMarcas();
      if (tab === 'users') loadUsers();
    });
  });
}

function setupAuth() {
  $('#form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = formData(e.target);
    try {
      const { data } = await api('/auth/login', { method: 'POST', body: JSON.stringify(fd) });
      setAuth(data.token, data.user);
      toast(`Bem-vindo, ${data.user.name}!`);
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  $('#form-register').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = formData(e.target);
    try {
      const { data } = await api('/auth/register', { method: 'POST', body: JSON.stringify(fd) });
      setAuth(data.token, data.user);
      toast('Conta criada com sucesso!');
      e.target.reset();
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  $('#btn-admin-quick').addEventListener('click', () => {
    const form = $('#form-login');
    form.email.value = 'admin@example.com';
    form.password.value = 'Admin1234';
    form.requestSubmit();
  });

  $('#btn-profile').addEventListener('click', async () => {
    try {
      const { data } = await api('/auth/profile');
      $('#profile-result').textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  $('#btn-logout').addEventListener('click', () => {
    clearAuth();
    toast('Sessão encerrada.');
  });
}

function setupCrud(config) {
  const { form, listEl, endpoint, fields, columns, titleEl, cancelBtn, refreshBtn } = config;

  async function load() {
    try {
      const { data } = await api(endpoint);
      renderTable(
        listEl,
        columns,
        data,
        (row) => `
          <button class="btn btn-secondary btn-sm" data-edit="${config.getId(row)}">Editar</button>
          <button class="btn btn-danger btn-sm" data-del="${config.getId(row)}">Excluir</button>
        `
      );

      listEl.querySelectorAll('[data-edit]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.edit;
          const row = data.find((r) => config.getId(r) === id);
          if (!row) return;
          form.id.value = id;
          fields.forEach((f) => {
            if (form[f]) form[f].value = row[f] ?? '';
          });
          titleEl.textContent = config.editTitle;
          cancelBtn.classList.remove('hidden');
        });
      });

      listEl.querySelectorAll('[data-del]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!confirm('Confirmar exclusão?')) return;
          try {
            await api(`${endpoint}/${btn.dataset.del}`, { method: 'DELETE' });
            toast('Registro excluído.');
            load();
          } catch (err) {
            toast(err.message, 'error');
          }
        });
      });
    } catch (err) {
      listEl.innerHTML = `<p class="empty">${err.message}</p>`;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = formData(form);
    const id = fd.id;
    delete fd.id;

    if (config.requirePassword && !id && !fd.password) {
      toast('Senha obrigatória ao criar.', 'error');
      return;
    }
    if (id && !fd.password) delete fd.password;

    Object.keys(fd).forEach((k) => {
      if (['year', 'engineCapacity'].includes(k) && fd[k]) fd[k] = Number(fd[k]);
    });

    try {
      if (id) {
        await api(`${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(fd) });
        toast('Registro atualizado.');
      } else {
        await api(endpoint, { method: 'POST', body: JSON.stringify(fd) });
        toast('Registro criado.');
      }
      form.reset();
      form.id.value = '';
      titleEl.textContent = config.createTitle;
      cancelBtn.classList.add('hidden');
      load();
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  cancelBtn.addEventListener('click', () => {
    form.reset();
    form.id.value = '';
    titleEl.textContent = config.createTitle;
    cancelBtn.classList.add('hidden');
  });

  refreshBtn.addEventListener('click', load);

  return load;
}

const loadCars = setupCrud({
  form: $('#form-cars'),
  listEl: $('#cars-list'),
  endpoint: '/cars',
  fields: ['brand', 'model', 'year', 'color'],
  getId: (r) => r._id,
  createTitle: 'Novo carro',
  editTitle: 'Editar carro',
  titleEl: $('#cars-form-title'),
  cancelBtn: $('#cars-cancel'),
  refreshBtn: $('#cars-refresh'),
  columns: [
    { label: 'Marca', render: (r) => r.brand },
    { label: 'Modelo', render: (r) => r.model },
    { label: 'Ano', render: (r) => r.year },
    { label: 'Cor', render: (r) => r.color },
  ],
});

const loadMotos = setupCrud({
  form: $('#form-motos'),
  listEl: $('#motos-list'),
  endpoint: '/motos',
  fields: ['brand', 'model', 'year', 'engineCapacity'],
  getId: (r) => r._id,
  createTitle: 'Nova moto',
  editTitle: 'Editar moto',
  titleEl: $('#motos-form-title'),
  cancelBtn: $('#motos-cancel'),
  refreshBtn: $('#motos-refresh'),
  columns: [
    { label: 'Marca', render: (r) => r.brand },
    { label: 'Modelo', render: (r) => r.model },
    { label: 'Ano', render: (r) => r.year },
    { label: 'Cilindrada', render: (r) => `${r.engineCapacity} cc` },
  ],
});

const loadMarcas = setupCrud({
  form: $('#form-marcas'),
  listEl: $('#marcas-list'),
  endpoint: '/marcas-roupa',
  fields: ['name', 'country', 'segment'],
  getId: (r) => r._id,
  createTitle: 'Nova marca',
  editTitle: 'Editar marca',
  titleEl: $('#marcas-form-title'),
  cancelBtn: $('#marcas-cancel'),
  refreshBtn: $('#marcas-refresh'),
  columns: [
    { label: 'Nome', render: (r) => r.name },
    { label: 'País', render: (r) => r.country },
    { label: 'Segmento', render: (r) => r.segment },
  ],
});

const loadUsers = setupCrud({
  form: $('#form-users'),
  listEl: $('#users-list'),
  endpoint: '/users',
  fields: ['name', 'email', 'password', 'role'],
  getId: (r) => String(r.id),
  createTitle: 'Novo usuário',
  editTitle: 'Editar usuário',
  titleEl: $('#users-form-title'),
  cancelBtn: $('#users-cancel'),
  refreshBtn: $('#users-refresh'),
  requirePassword: true,
  columns: [
    { label: 'ID', render: (r) => r.id },
    { label: 'Nome', render: (r) => r.name },
    { label: 'Email', render: (r) => r.email },
    { label: 'Role', render: (r) => r.role },
  ],
});

setupTabs();
setupAuth();
updateAuthUI(getUser());
