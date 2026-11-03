const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let moviesDB = [
    { id: '1', title: 'Интерстеллар', genre: 'Фантастика', rating: 10, completionRate: 95 },
    { id: '2', title: 'Начало', genre: 'Триллер', rating: 9, completionRate: 90 }
];

app.get('/api/v1/movies', (req, res) => {
    res.json(moviesDB);
});

app.post('/api/v1/movies', (req, res) => {
    const { title, genre, rating, completionRate } = req.bullet || req.body;
    if (!title || !genre) {
        return res.status(400).json({ message: 'Заполните обязательные поля' });
    }
    const newItem = {
        id: Date.now().toString(),
        title: title.trim(),
        genre: genre.trim(),
        rating: Number(rating) || 0,
        completionRate: Number(completionRate) || 0
    };
    moviesDB.push(newItem);
    res.status(201).json(newItem);
});

app.delete('/api/v1/movies/:id', (req, res) => {
    const { id } = req.params;
    moviesDB = moviesDB.filter(item => item.id !== id);
    res.json({ message: 'Успешно удалено' });
});

app.listen(PORT, () => {
    console.log(`Сервер успешно запущен на порту ${PORT}`);
});