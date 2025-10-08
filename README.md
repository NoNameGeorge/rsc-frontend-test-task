## Команды
`npm install` - установка зависимостей
`npm run demoCreatePalette` - собирать + запустить файл demoCreatePalette.ts
`npm run demoCreateTone` - собирать + запустить файл demoCreateTone.ts    
`npm run solution` - собирать + запустить файл solution.ts

## Что за файлы? о_О
-   `demoCreatePalette.ts` — основной файл с примерами вызовов `createPalette`; для просмотра результата запускайте его (например, `npm run demoCreatePalette`). Результат такой же, как в конце тестового задания
-   `demoCreateTone.ts` — отдельные примеры использования `createTone`
-   `solution.ts` — реализация функций и типовых утилит

** Текущая реализация createTone и createPalette сейчас в основном работает c ColorData и при этом ColorData должен быть как объект вызова в функциях тона и подтона. Можно было сделать и более универсально, но показалось, что будет много мороки и не факт, что это прям требуется

# Тестовое задание: Разработка системы управления цветовыми схемами и палитрами

## Описание задачи

Необходимо разработать типобезопасную систему для создания и управления цветовыми палитрами с возможностью комбинирования разных тонов и подтонов. Система должна обеспечивать гибкое создание палитр на основе базовых цветов с возможностью их расширения.

## Технические требования

1. Реализовать две основные функции:

    - `createTone` - функция для создания типобезопасного коллбэка, который можно использовать как самостоятельно, так и в связке с другими компонентами системы.
    - `createPalette` - функция для создания комплексной цветовой палитры с комбинированием базовых цветов, тонов и подтонов.

2. Обеспечить строгую типизацию для всех возвращаемых значений с поддержкой автодополнения в IDE.

## Детали реализации

### Исходные типы данных

```typescript
type ColorsUnion = 'red' | 'green' | 'blue' | 'yellow' // может быть расширяемым
type ColorData = {
    // тоже может быть любым
    main: string
    dark: string
    light: string
    extra: string
}

type InputModel = Record<ColorsUnion, ColorData>
```

### Функция createTone

Должна возвращать типобезопасный callback, принимающий следующие параметры:

-   Основная функция преобразования цветовых данных
-   Опциональный объект с настройками тона, включающий имя и подтоны

Пример использования:

```typescript
const baseColors = createTone((data) => ({
    background: data.main,
    color: data.main,
}))

const brightness = createTone(
    (data) => ({
        foreground: data.main,
        customProp: '#f0f0f0',
    }),
    {
        name: 'brightness',
        subtone: {
            low: (data) => ({ white: data.light }),
            medium: (data) => ({ shadow: data.main }),
            high: (data) => ({
                someProp: 'transparent',
                anotherProp: '#fff',
                thirdCustomProp: data.main,
            }),
            ultra: (data) => ({ intensive: data.extra }),
        },
    }
)

const depths = createTone(
    (data) => ({
        background: data.light,
        foreground: data.main,
        color: data.extra,
    }),
    {
        name: 'depth',
        subtone: {
            '8-bit': (data) => ({
                borderColor: data.main,
            }),
            '16-bit': (data) => ({
                borderColor: data.main,
                anotherColor: data.light,
            }),
            '24-bit': (data) => ({
                extraColor: data.extra,
            }),
        },
    }
)
```

### Функция createPalette

Принимает:

-   Исходный объект с цветовыми данными
-   Опциональный объект конфигурации с базовым тоном и дополнительными тонами

```typescript
const colors = createPalette(input, {
    base: baseColors,
    tones: {
        brightness,
        depths,
    },
})
```

Должна возвращать объект с комбинаторным перечислением ключей из исходных данных, тонов и подтонов, с правильной типизацией для каждого ключа.

## Ожидаемый результат

Результирующий объект должен иметь следующую структуру ключей:

-   Базовые цвета: `red`, `green`, `blue`, `yellow`
-   Комбинации цветов и тонов: `red_brightness`, `blue_depth` и тд.
-   Комбинации с подтонами: `red_low_brightness`, `blue_8-bit_depth` и тд.

Примеры типов для разных комбинаций:

```typescript
type ColorsBlue = {
    main: string
    dark: string
    light: string
    extra: string
    background: string
    color: string
}

type ColorsBlueBrightness = {
    foreground: string
    customProp: string
}

type ColorsBlueLowBrightness = {
    white: string
}

type ColorsBlueMediumBrightness = {
    shadow: string
}

type ColorsBlueHighBrightness = {
    someProp: string
    anotherProp: string
    thirdCustomProp: string
}

type ColorsBlueUltraBrightness = {
    intensive: string
}

type ColorsBlueDepth = {
    background: string
    foreground: string
    color: string
}

type ColorsBlue8BitDepth = {
    borderColor: string
}

type ColorsBlue16BitDepth = {
    borderColor: string
    anotherColor: string
}

type ColorsBlue24BitDepth = {
    extraColor: string
}

const colorsBlue: ColorsBlue = colors.blue
const colorsBlueBrightness: ColorsBlueBrightness = colors.blue_brightness
const colorsBlueLowBrightness: ColorsBlueLowBrightness = colors.blue_low_brightness
const colorsBlueMediumBrightness: ColorsBlueMediumBrightness = colors.blue_medium_brightness
const colorsBlueHighBrightness: ColorsBlueHighBrightness = colors.blue_high_brightness
const colorsBlueUltraBrightness: ColorsBlueUltraBrightness = colors.blue_ultra_brightness
const colorsBlueDepth: ColorsBlueDepth = colors.blue_depth
const colorsBlue8BitDepth: ColorsBlue8BitDepth = colors['blue_8-bit_depth']
const colorsBlue16BitDepth: ColorsBlue16BitDepth = colors['blue_16-bit_depth']
const colorsBlue24BitDepth: ColorsBlue24BitDepth = colors['blue_24-bit_depth']
```

## Пример исходных данных

```typescript
const input = {
    red: {
        main: 'red',
        dark: 'darkred',
        light: 'lightred',
        extra: 'extrared',
    },
    green: {
        main: 'green',
        dark: 'darkgreen',
        light: 'lightgreen',
        extra: 'extragreen',
    },
    blue: {
        main: 'blue',
        dark: 'darkblue',
        light: 'lightblue',
        extra: 'extrablue',
    },
    yellow: {
        main: 'yellow',
        dark: 'darkyellow',
        light: 'lightyellow',
        extra: 'extrayellow',
    },
} satisfies InputModel
```

Output

```json
{
    "red": {
        "main": "red",
        "dark": "darkred",
        "light": "lightred",
        "extra": "extrared",
        "background": "red",
        "color": "red"
    },
    "green": {
        "main": "green",
        "dark": "darkgreen",
        "light": "lightgreen",
        "extra": "extragreen",
        "background": "green",
        "color": "green"
    },
    "blue": {
        "main": "blue",
        "dark": "darkblue",
        "light": "lightblue",
        "extra": "extrablue",
        "background": "blue",
        "color": "blue"
    },
    "yellow": {
        "main": "yellow",
        "dark": "darkyellow",
        "light": "lightyellow",
        "extra": "extrayellow",
        "background": "yellow",
        "color": "yellow"
    },
    "red_brightness": { "foreground": "red", "customProp": "#f0f0f0" },
    "red_low_brightness": { "white": "lightred" },
    "red_medium_brightness": { "shadow": "red" },
    "red_high_brightness": {
        "someProp": "transparent",
        "anotherProp": "#fff",
        "thirdCustomProp": "red"
    },
    "red_ultra_brightness": { "intensive": "extrared" },
    "green_brightness": { "foreground": "green", "customProp": "#f0f0f0" },
    "green_low_brightness": { "white": "lightgreen" },
    "green_medium_brightness": { "shadow": "green" },
    "green_high_brightness": {
        "someProp": "transparent",
        "anotherProp": "#fff",
        "thirdCustomProp": "green"
    },
    "green_ultra_brightness": { "intensive": "extragreen" },
    "blue_brightness": { "foreground": "blue", "customProp": "#f0f0f0" },
    "blue_low_brightness": { "white": "lightblue" },
    "blue_medium_brightness": { "shadow": "blue" },
    "blue_high_brightness": {
        "someProp": "transparent",
        "anotherProp": "#fff",
        "thirdCustomProp": "blue"
    },
    "blue_ultra_brightness": { "intensive": "extrablue" },
    "yellow_brightness": { "foreground": "yellow", "customProp": "#f0f0f0" },
    "yellow_low_brightness": { "white": "lightyellow" },
    "yellow_medium_brightness": { "shadow": "yellow" },
    "yellow_high_brightness": {
        "someProp": "transparent",
        "anotherProp": "#fff",
        "thirdCustomProp": "yellow"
    },
    "yellow_ultra_brightness": { "intensive": "extrayellow" },
    "red_depth": { "background": "lightred", "foreground": "red", "color": "extrared" },
    "red_8-bit_depth": { "borderColor": "red" },
    "red_16-bit_depth": { "borderColor": "red", "anotherColor": "lightred" },
    "red_24-bit_depth": { "extraColor": "extrared" },
    "green_depth": {
        "background": "lightgreen",
        "foreground": "green",
        "color": "extragreen"
    },
    "green_8-bit_depth": { "borderColor": "green" },
    "green_16-bit_depth": { "borderColor": "green", "anotherColor": "lightgreen" },
    "green_24-bit_depth": { "extraColor": "extragreen" },
    "blue_depth": { "background": "lightblue", "foreground": "blue", "color": "extrablue" },
    "blue_8-bit_depth": { "borderColor": "blue" },
    "blue_16-bit_depth": { "borderColor": "blue", "anotherColor": "lightblue" },
    "blue_24-bit_depth": { "extraColor": "extrablue" },
    "yellow_depth": {
        "background": "lightyellow",
        "foreground": "yellow",
        "color": "extrayellow"
    },
    "yellow_8-bit_depth": { "borderColor": "yellow" },
    "yellow_16-bit_depth": { "borderColor": "yellow", "anotherColor": "lightyellow" },
    "yellow_24-bit_depth": { "extraColor": "extrayellow" }
}
```
