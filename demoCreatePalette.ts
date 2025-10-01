import { createPalette, type InputModel } from './solution.js'
import { baseColors, brightness, depths, gradients, shadows } from './demoCreateTone.js'

const paletteInput = {
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

const paletteDefault = createPalette(paletteInput)
type PaletteDefault = typeof paletteDefault
// console.log('paletteDefault', paletteDefault)

const paletteWithBase = createPalette(paletteInput, {
    base: baseColors,
})
type PaletteWithBase = typeof paletteWithBase
// console.log('paletteWithBase', paletteWithBase)

const paletteWithTones = createPalette(paletteInput, {
    tones: { brightness, depths },
})
type PaletteWithTones = typeof paletteWithTones
// console.log('paletteWithTones', paletteWithTones)

const paletteWithEmptyTones = createPalette(paletteInput, {
    tones: {},
})
type PaletteWithEmptyTones = typeof paletteWithEmptyTones
// console.log('paletteWithEmptyTones', paletteWithEmptyTones)

const paletteFull = createPalette(paletteInput, {
    base: baseColors,
    tones: { brightness, depths, gradients, shadows },
})
type PaletteFull = typeof paletteFull
// console.log('paletteFull', paletteFull)

const paletteLikeTaskExample = createPalette(paletteInput, {
    base: baseColors,
    tones: { brightness, depths },
})
type PaletteLikeTaskExample = typeof paletteLikeTaskExample
console.log('paletteLikeTaskExample', paletteLikeTaskExample)

// ================================================
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

const colorsBlue: ColorsBlue = paletteLikeTaskExample.blue
const colorsBlueBrightness: ColorsBlueBrightness = paletteLikeTaskExample.blue_brightness
const colorsBlueLowBrightness: ColorsBlueLowBrightness = paletteLikeTaskExample.blue_low_brightness
const colorsBlueMediumBrightness: ColorsBlueMediumBrightness = paletteLikeTaskExample.blue_medium_brightness
const colorsBlueHighBrightness: ColorsBlueHighBrightness = paletteLikeTaskExample.blue_high_brightness
const colorsBlueUltraBrightness: ColorsBlueUltraBrightness = paletteLikeTaskExample.blue_ultra_brightness
const colorsBlueDepth: ColorsBlueDepth = paletteLikeTaskExample.blue_depth
const colorsBlue8BitDepth: ColorsBlue8BitDepth = paletteLikeTaskExample['blue_8-bit_depth']
const colorsBlue16BitDepth: ColorsBlue16BitDepth = paletteLikeTaskExample['blue_16-bit_depth']
const colorsBlue24BitDepth: ColorsBlue24BitDepth = paletteLikeTaskExample['blue_24-bit_depth']
