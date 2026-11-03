const API_BASE_URL = 'http://localhost:3000/api/v1';

const movieForm = document.getElementById('movieForm');
const moviesTbody = document.getElementById('moviesTbody');
const loadingSpinner = document.getElementById('loadingSpinner');
const btnRefresh = document.getElementById('btnRefresh');
const formAlert = document.getElementById('formAlert');

// 1. Загрузка и рендеринг истории просмотров (GET)
async function fetchAndRenderMovies() {
    loadingSpinner.classList.remove('hidden');
    try {
        const response = await fetch(`${API_BASE_URL}/movies`);
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.statusText}`);
        
        const movies = await response.json();
        moviesTbody.innerHTML = '';

        if (movies.length === 0) {
            moviesTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">История просмотров пуста</td></tr>';
            return;
        }

        movies.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${escapeHtml(item.title)}</strong></td>
                <td>${escapeHtml(item.genre)}</td>
                <td>⭐ ${item.rating}/10</td>
                <td>📊 ${item.completionRate}%</td>
                <td>
                    <button class="btn btn-secondary" onclick="deleteMovie('${item.id}')" style="padding: 4px 8px; font-size: 12px;">Удалить</button>
                </td>
            `;
            moviesTbody.appendChild(tr);
        });
    } catch (err) {
        showAlert(`Не удалось загрузить данные: ${err.message}`, 'error');
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

// 2. Отправка нового просмотра / оценки (POST)
movieForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newRecord = {
        title: document.getElementById('movieTitle').value.trim(),
        genre: document.getElementById('movieGenre').value.trim(),
        rating: parseInt(document.getElementById('userRating').value, 10),
        completionRate: parseInt(document.getElementById('completionRate').value, 10)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/movies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecord)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Ошибка сохранения');
        }

        showAlert('Данные просмотра успешно сохранены!', 'success');
        movieForm.reset();
        fetchAndRenderMovies();
    } catch (err) {
        showAlert(err.message, 'error');
    }
});

// 3. Удаление записи (DELETE) — самостоятельное задание из методички
async function deleteMovie(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Ошибка удаления');
        fetchAndRenderMovies();
    } catch (err) {
        showAlert(err.message, 'error');
    }
}

// Вспомогательные функции
function showAlert(msg, type) {
    formAlert.textContent = msg;
    formAlert.className = `alert alert-${type}`;
    setTimeout(() => formAlert.classList.add('hidden'), 4000);
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[m]));
}

// Инициализация
btnRefresh.addEventListener('click', fetchAndRenderMovies);
document.addEventListener('DOMContentLoaded', fetchAndRenderMovies);