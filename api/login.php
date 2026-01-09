<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $username = $data['username'] ?? '';
    $password = md5($data['password'] ?? '');
    
    $sql = "SELECT id, username FROM users WHERE username = ? AND password = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$username, $password]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo json_encode([
            'success' => true,
            'user' => $user,
            'token' => md5($username . time()) // Простой токен
        ]);
    } else {
        echo json_encode(['error' => 'Неверный логин или пароль']);
    }
}
?>