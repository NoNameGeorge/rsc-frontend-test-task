import { createTone, type ColorData, type ToneInstance, type Subtones } from './solution.js'



// Пример 1 ==================================
const baseColors = createTone((data) => ({
    background: data.main,
    color: data.main,
}))
export type BaseColors = typeof baseColors
export type BaseColorsResult = ReturnType<typeof baseColors>

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
export type Brightness = typeof brightness
export type BrightnessResult = ReturnType<typeof brightness>

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
export type Depths = typeof depths
export type DepthsResult = ReturnType<typeof depths>

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
export type Gradients = typeof gradients
export type GradientsResult = ReturnType<typeof gradients>

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
export type Shadows = typeof shadows
export type ShadowsResult = ReturnType<typeof shadows>

// ==============================
const demoColorData: ColorData = {
    main: '#3366FF',
    dark: '#1A2A6C',
    light: '#86A8E7',
    extra: '#FF4081',
}

const neutralTone = createTone((data) => ({
    background: data.light,
    foreground: data.dark,
    border: data.main,
}))
export type NeutralTone = typeof neutralTone
export type NeutralToneResult = ReturnType<typeof neutralTone>

const accentTone = createTone(
    (data) => ({
        primary: data.main,
        secondary: data.extra,
        contrast: data.dark,
    }),
    {
        name: 'accent',
        subtone: {
            vivid: (data) => ({ highlight: data.extra }),
            muted: (data) => ({ highlight: data.light }),
        },
    }
)
export type AccentTone = typeof accentTone
export type AccentToneResult = ReturnType<typeof accentTone>

const monochromeTone = createTone(
    (data) => ({
        text: data.dark,
        base: data.main,
        overlay: data.light,
    }),
    {
        name: 'monochrome',
        subtone: {
            light: (data) => ({ tint: `${data.light}99` }),
            shadow: (data) => ({ shade: `${data.dark}CC` }),
        },
    }
)
export type MonochromeTone = typeof monochromeTone
export type MonochromeToneResult = ReturnType<typeof monochromeTone>
