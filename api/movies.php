<?php
require_once 'config.php';

// SQL запрос для получения всех фильмов
$sql = "SELECT * FROM movies ORDER BY created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute();

// Получаем все строки
$movies = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Отправляем данные в формате JSON
echo json_encode($movies, JSON_UNESCAPED_UNICODE);
?>