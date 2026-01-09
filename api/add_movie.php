<?php
require_once 'config.php';

// Разрешаем загрузку файлов
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные из формы
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $year = $_POST['year'] ?? '';
    $genre = $_POST['genre'] ?? '';
    $duration = $_POST['duration'] ?? '';
    $rating = $_POST['rating'] ?? 0;
    
    // Обработка загрузки изображения
    $image_url = 'images/default.jpg'; // Значение по умолчанию
    
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../images/uploads/';
        
        // Создаем папку, если не существует
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_name = time() . '_' . basename($_FILES['image']['name']);
        $file_path = $upload_dir . $file_name;
        
        // Проверяем тип файла
        $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        $file_type = mime_content_type($_FILES['image']['tmp_name']);
        
        if (!in_array($file_type, $allowed_types)) {
            echo json_encode(['error' => 'Неподдерживаемый тип файла. Используйте JPG, PNG или GIF.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        // Перемещаем загруженный файл
        if (move_uploaded_file($_FILES['image']['tmp_name'], $file_path)) {
            $image_url = 'images/uploads/' . $file_name;
        } else {
            echo json_encode(['error' => 'Ошибка при загрузке файла'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
    
    // Валидация данных
    if (empty($title) || empty($description) || empty($year) || empty($genre) || empty($duration)) {
        echo json_encode(['error' => 'Все поля обязательны для заполнения'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // SQL запрос для добавления фильма
    $sql = "INSERT INTO movies (title, description, year, genre, duration, rating, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute([$title, $description, $year, $genre, $duration, $rating, $image_url])) {
        echo json_encode(['success' => 'Фильм добавлен успешно'], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['error' => 'Ошибка при добавлении фильма'], JSON_UNESCAPED_UNICODE);
    }
} else {
    // Показываем информацию о методе
    echo json_encode([
        'error' => 'Неправильный метод запроса',
        'expected' => 'POST',
        'received' => $_SERVER['REQUEST_METHOD']
    ], JSON_UNESCAPED_UNICODE);
}
?>