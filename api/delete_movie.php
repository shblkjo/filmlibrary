<?php
require_once 'config.php';

// Для DELETE запросов данные приходят в теле запроса
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'DELETE') {
    // Получаем данные из тела запроса
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    $id = $data['id'] ?? 0;
    
    if ($id == 0) {
        echo json_encode(['error' => 'Не указан ID фильма'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // SQL запрос для удаления фильма
    $sql = "DELETE FROM movies WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute([$id])) {
        echo json_encode(['success' => 'Фильм удален успешно'], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['error' => 'Ошибка при удалении фильма'], JSON_UNESCAPED_UNICODE);
    }
} else {
    echo json_encode([
        'error' => 'Неправильный метод запроса',
        'expected' => 'DELETE',
        'received' => $method
    ], JSON_UNESCAPED_UNICODE);
}
?>