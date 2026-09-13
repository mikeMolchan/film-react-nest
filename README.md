# FILM!

## Установка

### MongoDB

Установите MongoDB скачав дистрибутив с официального сайта или с помощью пакетного менеджера вашей ОС. Также можно воспользоваться Docker (см. ветку `feat/docker`).

Импортируйте тестовые данные из файла `backend/test/mongodb_initial_stub.json` (например, через MongoDB Compass: Add Data → Import JSON or CSV file).

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `mongodb`
* `DATABASE_URL` - адрес СУБД MongoDB, например `mongodb://127.0.0.1:27017/practicum`.
* `PORT` - порт, на котором запустится сервер, например `3000`.

MongoDB должна быть установлена и запущена.

Запустите бэкенд:

`npm run start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.