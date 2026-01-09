<?php
require_once 'config.php';

session_destroy();
echo json_encode(['success' => 'Вы вышли из системы']);
?>