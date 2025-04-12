<?php

function connect()
{
    return new PDO("pgsql:host=localhost;port=5432;dbname=polinaJs",
        "postgres",
        "");
}

function query($sql, $params)
{
    $db = connect();
    $query = $db->prepare($sql);
    $query->execute($params);
    return $query;
}

function select($sql, $params)
{
    return query($sql, $params)->fetchAll();
}

function select1($sql, $params)
{
    $array = select($sql, $params);
    if (!empty($array)) {
        return $array[0];
    } else {
        return null;
    }
}

function delete($sql, $params)
{
    return query($sql, $params)->rowCount();
}

function update($sql, $params)
{
    return query($sql, $params)->rowCount();
}

function insert($sql, $params)
{
    $db = connect();
    $query = $db->prepare($sql);
    $query->execute($params);
    return $db->lastInsertId();
}