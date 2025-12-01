// === BRO SCHOOL - ОПТИМИЗИРОВАННЫЙ MAP.JS ===

// Конфигурация адресов
const LOCATIONS = {
    main: "Москва, улица Ибрагимова, 30",
    snowboard: "https://yandex.com/maps/-/CLG5IU0n",
    skate: {
        1: "https://yandex.com/maps/-/CLG5ELNm",      // Хорошёво-Мнёвники
        2: "https://yandex.ru/maps/-/CCQ~fJWctA",     // Перовский парк
        3: "https://yandex.ru/maps/-/CCQ~fJS18D",     // Семеновская
        4: "https://yandex.ru/maps/-/CCQ~fJf7OA",     // Черкизовский парк
        5: "https://yandex.com/maps/-/CLG5BY-F",      // Красная Пресня
        6: "https://yandex.ru/maps/-/CCQ~fJRQ-B",     // Ходынское поле
        7: "https://yandex.com/maps/-/CLG5mCL8"       // Некрасовка
    }
};

// Основные функции карт
function openInYandexMaps() {
    const url = `https://yandex.ru/maps/?text=${encodeURIComponent(LOCATIONS.main)}`;
    window.open(url, '_blank');
}

function buildRoute() {
    const url = `https://yandex.ru/maps/?rtext=~${encodeURIComponent(LOCATIONS.main)}`;
    window.open(url, '_blank');
}

// Функции для конкретных направлений
function buildRouteSnowboard() {
    window.open(LOCATIONS.snowboard, '_blank');
}

function buildRouteSkate1() { window.open(LOCATIONS.skate[1], '_blank'); }
function buildRouteSkate2() { window.open(LOCATIONS.skate[2], '_blank'); }
function buildRouteSkate3() { window.open(LOCATIONS.skate[3], '_blank'); }
function buildRouteSkate4() { window.open(LOCATIONS.skate[4], '_blank'); }
function buildRouteSkate5() { window.open(LOCATIONS.skate[5], '_blank'); }
function buildRouteSkate6() { window.open(LOCATIONS.skate[6], '_blank'); }
function buildRouteSkate7() { window.open(LOCATIONS.skate[7], '_blank'); }

console.log('Bro School - карта с несколькими адресами загружена');