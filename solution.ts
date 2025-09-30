type ColorsUnion = 'red' | 'green' | 'blue' | 'yellow' // может быть расширяемым
type ColorData = {
    // тоже может быть любым
    main: string
    dark: string
    light: string
    extra: string
}

type CustomColorData = {
    primary: string
    secondary: string
    tertiary: string
}

type InputModel = Record<ColorsUnion, ColorData>

/**
 * Описание функции createTone, как я его понял
 * Функция transform есть у нас всегда
 * Объект options опционален, но name и subtone всегда вместе
 * data у transform и subtone будет иметь одинаковый тип
 * *но можно сделать и разный, просто нужен будет еще один дженерик
 * name преобразую в toneName, т.к. у функции есть свой name и он равен названию функции
 * в типе возвращаемом функцией всегда есть transform
 * toneName и subtone есть только если есть options,
 *  но т.к. name и subtone всегда вместе, то можно сделать и так, чтобы проверка была относительно name, например
 * Типизация должна быть максимально универсальной и подробной, как я понял
 */

type ColorTransform<
    TData extends Record<string, string>,
    TResult extends Record<string, string> = Record<string, string>
> = (data: TData) => TResult
type Subtones<TData extends Record<string, string>> = Record<string, ColorTransform<TData>>

function createTone<
    TData extends Record<string, string> = ColorData,
    TTransformResult extends Record<string, string> = Record<string, string>
>(transform: ColorTransform<TData, TTransformResult>): { (data: TData): TTransformResult }

function createTone<
    TSubtones extends Subtones<TData>,
    TName extends string,
    TData extends Record<string, string> = ColorData,
    TTransformResult extends Record<string, string> = Record<string, string>
>(
    transform: ColorTransform<TData, TTransformResult>,
    options: { name: TName; subtone: TSubtones }
): { (data: TData): TTransformResult; toneName: TName; subtone: TSubtones }

function createTone<
    TName extends string,
    TData extends Record<string, string>,
    TTransformResult extends Record<string, string>,
    TSubtones extends Subtones<TData>
>(
    transform: ColorTransform<TData, TTransformResult>,
    options?: { name: TName; subtone: TSubtones }
) {
    const toneFunction = (data: TData) => transform(data)

    if (options?.name) {
        Object.defineProperty(toneFunction, 'toneName', {
            value: options.name,
            enumerable: true,
            writable: false,
        })
    }
    if (options?.subtone) {
        const frozen = Object.freeze(options.subtone)
        Object.defineProperty(toneFunction, 'subtone', {
            value: frozen,
            enumerable: true,
            writable: false,
        })
    }

    return toneFunction
}

// Пример 1 ==================================
const baseColors = createTone((data) => ({
    background: data.main,
    color: data.main,
}))
type TBaseColors = typeof baseColors

// Пример 2 ==================================
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
type TBrightness = typeof brightness

// Пример 3 ==================================
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
type TDepths = typeof depths

// Пример 4 ==================================
const gradients = createTone(
    (data) => ({
        primary: `linear-gradient(45deg, ${data.main}, ${data.light})`,
        secondary: `linear-gradient(135deg, ${data.dark}, ${data.main})`,
        accent: `radial-gradient(circle, ${data.light}, ${data.extra})`,
    }),
    {
        name: 'gradients',
        subtone: {
            horizontal: (data) => ({
                leftToRight: `linear-gradient(90deg, ${data.main}, ${data.light})`,
            }),
            vertical: (data) => ({
                topToBottom: `linear-gradient(180deg, ${data.main}, ${data.dark})`,
            }),
            diagonal: (data) => ({
                cornerToCorner: `linear-gradient(45deg, ${data.light}, ${data.dark})`,
            }),
        },
    }
)
type TGradients = typeof gradients

// Пример 5 ==================================
const shadows = createTone(
    (data) => ({
        dropShadow: `0 4px 8px ${data.dark}40`,
        innerShadow: `inset 0 2px 4px ${data.dark}60`,
        glow: `0 0 20px ${data.main}80`,
    }),
    {
        name: 'shadows',
        subtone: {
            subtle: (data) => ({
                lightShadow: `0 1px 3px ${data.light}30`,
            }),
            dramatic: (data) => ({
                heavyShadow: `0 8px 32px ${data.dark}70`,
            }),
            neon: (data) => ({
                neonGlow: `0 0 40px ${data.extra}90`,
            }),
        },
    }
)
type TShadows = typeof shadows

// Пример 6 ==================================
const customTone = createTone((data: CustomColorData) => ({
    custom: data.primary,
}))
type TCustomTone = typeof customTone


// =============== createPalette ===============
/**
 * ***решил оставить
 *
 * Логика работы createPalette (для себя для удобства)
 * 1. Берем input (объект с цветовыми данными)
 * 2. Если есть base - прогоняем каждый цвет через base
 * 2.1. Берем результат base, соединяем с input[цвет] и записываем как "цвет"
 * 2.2. Технически base может иметь subtone, но ее мы вроде не используем (да же?)
 * 3. Далее работаем с tones, если они есть
 * 3.1. Каждый input прогоняем через tone(data
 * 3.2. Полученный результат записываем как "цвет_имя_тона" (например: "red_brightness")
 * 3.3. Далее прогоняем input через subtone текущего тона
 * 3.4. Полученный результат записываем как "цвет_подтон_имя_тона" (например: "red_low_brightness")
 * 4. Вроде как все, соединяем все в один объект и возвращаем
 */


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
    // blue: {
    //     main: 'blue',
    //     dark: 'darkblue',
    //     light: 'lightblue',
    //     extra: 'extrablue',
    // },
    // yellow: {
    //     main: 'yellow',
    //     dark: 'darkyellow',
    //     light: 'lightyellow',
    //     extra: 'extrayellow',
    // },
}
// satisfies InputModel


function createPalette(
    input: Record<string, Record<string, string>>,
    options?: {
        base: {
            (data: Record<string, string>): Record<string, string>
            toneName?: string
            subtone?: Record<string, (data: Record<string, string>) => Record<string, string>>
        }
        tones: Record<string, {
            (data: Record<string, string>): Record<string, string>
            toneName?: string
            subtone?: Record<string, (data: Record<string, string>) => Record<string, string>>
        }>
    } 
) {
    
    return {} as any
}

const palette = createPalette(input, {
    base: baseColors,
    tones: { brightness, depths },
})
type TPalette = typeof palette

const palette1 = createPalette(input)
type TPalette1 = typeof palette1

const palette2 = createPalette(input, {
    base: baseColors,
})
type TPalette2 = typeof palette2

const palette3 = createPalette(input, {
    tones: { brightness, depths },
})
type TPalette3 = typeof palette3