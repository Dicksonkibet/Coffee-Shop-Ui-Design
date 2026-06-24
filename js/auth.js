/* =============================================
   AUTH.JS — Login, Register, Session, Persist
============================================= */

const Auth = (() => {
  const USERS_KEY  = 'ba_users';
  const SESSION_KEY = 'ba_session';

  // ---------- Helpers ----------
  const getUsers   = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const saveUsers  = u => localStorage.setItem(USERS_KEY, JSON.stringify(u));
  const getSession = () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  const saveSession = s => localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  const clearSession = () => localStorage.removeItem(SESSION_KEY);

  const hashSimple = str => {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    return h.toString(16);
  };

  // ---------- Public API ----------
  const register = (name, email, password) => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, msg: 'An account with this email already exists.' };
    }
    const user = { id: Date.now(), name, email: email.toLowerCase(), hash: hashSimple(password), joined: new Date().toLocaleDateString() };
    users.push(user);
    saveUsers(users);
    saveSession({ id: user.id, name: user.name, email: user.email, joined: user.joined });
    return { ok: true, user };
  };

  const login = (email, password) => {
    const users = getUsers();
    const user  = users.find(u => u.email === email.toLowerCase() && u.hash === hashSimple(password));
    if (!user) return { ok: false, msg: 'Incorrect email or password.' };
    saveSession({ id: user.id, name: user.name, email: user.email, joined: user.joined });
    return { ok: true, user };
  };

  const logout = () => { clearSession(); window.location.href = getRootPath() + 'index.html'; };

  const currentUser = () => getSession();

  const isLoggedIn  = () => !!getSession();

  return { register, login, logout, currentUser, isLoggedIn };
})();

/* ---------- Nav Auth UI ---------- */
function getRootPath() {
  const depth = window.location.pathname.split('/').filter(Boolean).length;
  const inPages = window.location.pathname.includes('/pages/');
  return inPages ? '../' : './';
}

function updateNavAuth() {
  const el = document.getElementById('nav-auth');
  if (!el) return;
  const user = Auth.currentUser();
  if (user) {
    const initials = user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    el.innerHTML = `
      <div class="user-nav">
        <div class="avatar">${initials}</div>
        <span class="user-name">Hi, ${user.name.split(' ')[0]}</span>
        <button class="btn-logout" onclick="Auth.logout()">Logout</button>
      </div>`;
  }
}

document.addEventListener('DOMContentLoaded', updateNavAuth);

/* ---------- Toast ---------- */
function showToast(msg, type = 'success') {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = `toast ${type}`;
  requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
  setTimeout(() => t.classList.remove('show'), 3200);
}

/* ---------- Login Form ---------- */
const loginForm = document.getElementById('login-form');
if (loginForm) {
  // Redirect if already logged in
  if (Auth.isLoggedIn()) window.location.href = '../index.html';

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    let valid = true;
    if (!email)    { showError('email-err', 'Email is required.'); valid = false; }
    if (!password) { showError('pw-err', 'Password is required.'); valid = false; }
    if (!valid) return;

    const result = Auth.login(email, password);
    if (!result.ok) { showError('pw-err', result.msg); document.getElementById('password').classList.add('error'); return; }

    showToast(`Welcome back, ${result.user.name}! ☕`);
    setTimeout(() => window.location.href = '../index.html', 1200);
  });
}

/* ---------- Register Form ---------- */
const registerForm = document.getElementById('register-form');
if (registerForm) {
  if (Auth.isLoggedIn()) window.location.href = '../index.html';

  const pwInput = document.getElementById('password');
  const fill    = document.getElementById('strength-fill');
  const label   = document.getElementById('strength-label');

  if (pwInput) {
    pwInput.addEventListener('input', () => {
      const v = pwInput.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^a-zA-Z0-9]/.test(v)) score++;

      const info = [
        { w:'0%',   bg:'#e0d0c0', t:'' },
        { w:'25%',  bg:'#e05252', t:'Weak' },
        { w:'50%',  bg:'#e09a2b', t:'Fair' },
        { w:'75%',  bg:'#4aaa6e', t:'Good' },
        { w:'100%', bg:'#2d7a4f', t:'Strong' },
      ][score];
      if (fill)  { fill.style.width = info.w; fill.style.background = info.bg; }
      if (label) { label.textContent = info.t; label.style.color = info.bg; }
    });
  }

  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();
    const name  = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const pw    = document.getElementById('password').value;
    const pw2   = document.getElementById('confirm-pw').value;

    let valid = true;
    if (!name)             { showError('name-err', 'Full name is required.'); valid = false; }
    if (!validateEmail(email)) { showError('email-err', 'Enter a valid email address.'); valid = false; }
    if (pw.length < 8)    { showError('pw-err', 'Password must be at least 8 characters.'); valid = false; }
    if (pw !== pw2)        { showError('pw2-err', 'Passwords do not match.'); valid = false; }
    if (!valid) return;

    const result = Auth.register(name, email, pw);
    if (!result.ok) { showError('email-err', result.msg); return; }

    showToast('Account created! Welcome to Brewed Awakenings ☕', 'success');
    setTimeout(() => window.location.href = '../index.html', 1400);
  });
}

/* ---------- Helpers ---------- */
function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}
function clearErrors() {
  document.querySelectorAll('.field-error').forEach(e => e.style.display = 'none');
  document.querySelectorAll('.input-wrap input').forEach(e => e.classList.remove('error'));
}
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

/* ---------- Toggle Password ---------- */
document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', () => {
    const inp = btn.previousElementSibling;
    if (!inp) return;
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    btn.textContent = isText ? '👁' : '🙈';
  });
});
