<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Получаем комментарии для фильма
    $movie_id = isset($_GET['movie_id']) ? intval($_GET['movie_id']) : 0;
    
    $sql = "SELECT * FROM comments WHERE movie_id = ? ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$movie_id]);
    
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($comments, JSON_UNESCAPED_UNICODE);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Добавляем новый комментарий
    $data = json_decode(file_get_contents("php://input"), true);
    
    $movie_id = $data['movie_id'] ?? 0;
    $user_name = $data['user_name'] ?? 'Аноним';
    $comment_text = $data['comment_text'] ?? '';
    
    if (empty($comment_text)) {
        echo json_encode(['error' => 'Комментарий не может быть пустым']);
        exit;
    }
    
    $sql = "INSERT INTO comments (movie_id, user_name, comment_text) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute([$movie_id, $user_name, $comment_text])) {
        echo json_encode(['success' => 'Комментарий добавлен']);
    } else {
        echo json_encode(['error' => 'Ошибка при добавлении комментария']);
    }
}
?>