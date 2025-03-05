Запросы для сервера черз Invoke-WebRequest


1. Получить все товары(Get)
```PowerShell
Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET
```

2.Добавить товар(Post)
```PowerShell
$json = @'
{
  "name": "Новый товар",
  "price": 999,
  "description": "Тестовое описание",
  "categories": ["Тест"]
}
'@

Invoke-RestMethod -Uri "http://localhost:8080/api/products" `
  -Method POST `
  -Body $json `
  -ContentType "application/json"
```

3. Обновить товар по ID(PUT)
```PowerShell
$json = @'
{
  "name": "Обновленное название",
  "price": 1999,
  "categories": ["Новая категория"]
}
'@

# Замените 1 на нужный ID товара
Invoke-RestMethod -Uri "http://localhost:8080/api/products/1" `
  -Method PUT `
  -Body $json `
  -ContentType "application/json"
```

4.Удалить товар по ID(DELETE)
```PowerShell
# Замените 1 на нужный ID товара
Invoke-RestMethod -Uri "http://localhost:8080/api/products/1" -Method DELETE
```


Как это работает:

1. 
```PowerShell
$json
```
— переменная с JSON-телом запроса (для POST/PUT).

2.
```PowerShell
-ContentType
```
 — указывает, что данные в теле запроса в формате JSON.

3.
```PowerShell
`
```
— символ переноса строки в PowerShell.

4. Ответ от сервера автоматически конвертируется в объект PowerShell.