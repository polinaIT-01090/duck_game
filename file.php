<?php
require "function.php";

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'];
$password = $data['password'];
$score = $data['score'];
$time = $data['time'];
$user = null;
$error = null;

if (isset($score) and isset($time)) {
    if (isset($name) and isset($password)) {
        $user = select('select * from  users where name = :name',
            [
                'name' => $name
            ]);
        if (!empty($user[0])) {
            if ($password === $user[0]['password']) {
                update(
                    "UPDATE users SET time = :time, score = :score where name = :name",
                    [
                        'time' => floor($time / 1000),
                        'score' => $score,
                        'name' => $name
                    ]
                );
            } else {
                $error = "неверный пароль или логин";
            }
        } else {
            insert('INSERT INTO users (name, password, time, score) values (:name, :password, :time, :score)',
                [
                    'name' => $name,
                    'password' => $password,
                    'time' => floor($time / 1000),
                    'score' => $score,
                ]);
        }
    } else {
        $error = "Введите все поля";
    }
}

$users = select('select name, score, time from users order by score desc, time asc limit 20', []);

echo json_encode([
    'error' => $error,
    'user' => $user,
    'users' => $users
]);