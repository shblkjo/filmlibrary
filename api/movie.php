<?php
require_once 'config.php';

// Получаем ID из параметра запроса
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// SQL запрос для получения одного фильма
$sql = "SELECT * FROM movies WHERE id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);

// Получаем данные
$movie = $stmt->fetch(PDO::FETCH_ASSOC);

if ($movie) {
    echo json_encode($movie, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(['error' => 'Фильм не найден'], JSON_UNESCAPED_UNICODE);
}
?>