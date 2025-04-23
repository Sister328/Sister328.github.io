
// Конфетти
const canvas = document.getElementById('confetti-canvas');

// Проверка, что canvas существует
if (canvas) {
    const ctx = canvas.getContext('2d');

    // Проверка, что контекст получен успешно
    if (ctx) {
        const confettiParticles = [];
        const numberOfConfetti = 100;

        // Функция для создания случайного цвета в формате hsl
        function getRandomHslColor() {
            return `hsl(${Math.random() * 360}, 70%, 60%)`;
        }

        // Массив возможных форм конфетти
        const confettiShapes = ["circle", "star"];

        // Функция для выбора случайной формы конфетти
        function getRandomShape() {
            return confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
        }


        // Настройка размеров канваса
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas(); // Устанавливаем размеры канваса при загрузке страницы

        // Базовая скорость падения конфетти
        let baseVelocity = 2;

        // Флаг, указывающий, нужно ли увеличить скорость
        let isSpeedBoosted = false;

        // Функция для получения текущей скорости падения
        function getCurrentVelocity() {
            return baseVelocity + (isSpeedBoosted ? 3 : 0); // Увеличиваем на 3, если isSpeedBoosted = true
        }


        // Создание конфетти
        function createConfetti() {
            confettiParticles.length = 0; // Очищаем массив конфетти
            for (let i = 0; i < numberOfConfetti; i++) {
                confettiParticles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height - canvas.height, // Начинаем сверху экрана
                    radius: Math.random() * 5 + 2,
                    color: getRandomHslColor(), // Случайный цвет
                    tilt: Math.random() * 10 - 5, // Наклон
                    tiltAngle: Math.random() * 0.1 + 0.05, // Скорость изменения наклона
                    velocity: getCurrentVelocity(), // Скорость падения (зависит от isSpeedBoosted)
                    shape: getRandomShape() // Случайная форма
                });
            }
        }

        // Рисование конфетти
        function drawConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            confettiParticles.forEach(confetti => {
                ctx.beginPath();

                if (confetti.shape === "circle") {
                    // Рисуем круг
                    ctx.ellipse(confetti.x, confetti.y, confetti.radius, confetti.radius, 0, 0, 2 * Math.PI);
                } else if (confetti.shape === "star") {
                    // Рисуем звезду
                    drawStar(ctx, confetti.x, confetti.y, confetti.radius, confetti.radius / 2, 5); // x, y, outerRadius, innerRadius, points
                }


                ctx.fillStyle = confetti.color;
                ctx.fill();
                confetti.x += Math.sin(confetti.tilt);
                confetti.y += confetti.velocity;
                confetti.tilt += confetti.tiltAngle;

                // Перемещение конфетти обратно наверх, когда они выходят за пределы экрана
                if (confetti.y > canvas.height) {
                    confetti.y = 0;
                    confetti.x = Math.random() * canvas.width;
                    confetti.velocity = getCurrentVelocity(); // Обновляем скорость после пересоздания
                }
            });
        }

        // Функция для рисования звезды
        function drawStar(ctx, x, y, outerRadius, innerRadius, points) {
            let rot = Math.PI / 2 * 3;
            let step = Math.PI / points;
            ctx.beginPath();
            ctx.moveTo(x, y - outerRadius);
            for (let i = 0; i < points; i++) {
                ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
                rot += step;
                ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
                rot += step;
            }
            ctx.lineTo(x, y - outerRadius);
            ctx.closePath();
        }


        // Анимация конфетти
        function updateConfetti() {
            drawConfetti();
            requestAnimationFrame(updateConfetti);
        }

        // Запуск анимации сразу
        createConfetti();
        updateConfetti();


        // Кнопка "Повторить конфетти" (теперь ускоряет и обновляет конфетти)
        const repeatButton = document.getElementById('repeat-confetti');
        if (repeatButton) {
            repeatButton.addEventListener('click', () => {
                isSpeedBoosted = true; // Устанавливаем флаг ускорения
                createConfetti(); // Создаем новые конфетти с увеличенной скоростью
            });
        } else {
            console.log('Кнопка "Повторить конфетти" не найдена!');
        }



        // Музыкальный плеер
        const music = document.getElementById('music');
        const playPauseButton = document.getElementById('play-pause');
        const volumeControl = document.getElementById('volume');
        const restartButton = document.getElementById('restart-music'); // Получаем ссылку на новую кнопку

        if (music && playPauseButton && volumeControl && restartButton) { // Добавляем проверку на наличие новой кнопки
            // Функция для переключения воспроизведения
            function togglePlayPause() {
                if (music.paused) {
                    music.play();
                    playPauseButton.textContent = 'Пауза';
                } else {
                    music.pause();
                    playPauseButton.textContent = 'Играть';
                }
            }


            // Обработчик клика по кнопке "Играть/Пауза"
            playPauseButton.addEventListener('click', togglePlayPause);

            // Обработчик клика по кнопке "Начать сначала"
            restartButton.addEventListener('click', () => { // Добавляем обработчик для новой кнопки
                music.currentTime = 0; // Перематываем музыку в начало
                music.play();          // Начинаем воспроизведение (можно убрать, если не нужно автоматическое воспроизведение)
                playPauseButton.textContent = 'Пауза'; // Устанавливаем текст кнопки в "Пауза"
            });

            // Обработчик изменения громкости
            volumeControl.addEventListener('input', () => {
                music.volume = volumeControl.value;
            });


            // Добавляем обработчик события canplaythrough, чтобы убедиться, что музыка загружена
            music.addEventListener('canplaythrough', () => {
                console.log('Музыка загружена');
            });


            // Добавляем обработчик события ended, чтобы кнопка снова отображала "Играть"
            music.addEventListener('ended', () => {
                playPauseButton.textContent = 'Играть';
            });


        } else {
            console.log('Элементы музыкального плеера не найдены!');
        }



    } else {
        console.error('Не удалось получить 2D контекст для canvas!');
    }
} else {
    console.error('Элемент canvas с id "confetti-canvas" не найден!');
}
