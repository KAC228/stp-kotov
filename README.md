# СТП-КОТОВ — сайт КСД

Сайт камер статического давления (Next.js, статический экспорт на reg.ru).

## Разработка

```bash
npm install
npm run dev
```

Открыть http://localhost:3000

## Выгрузка на хостинг

См. [DEPLOY-REG.RU.md](./DEPLOY-REG.RU.md)

Перед первым деплоем: скопируйте `public/send.php.example` → `public/send.php` и укажите токен Telegram.

## Сборка

```bash
npm run build
```

Результат в папке `out/`.
