"use strict";
function createTone(transform, options) {
    const toneFunction = (data) => transform(data);
    if (options?.name) {
        Object.defineProperty(toneFunction, 'toneName', {
            value: options.name,
            enumerable: true,
            writable: false,
        });
    }
    if (options?.subtone) {
        const frozen = Object.freeze(options.subtone);
        Object.defineProperty(toneFunction, 'subtone', {
            value: frozen,
            enumerable: true,
            writable: false,
        });
    }
    return toneFunction;
}
// Пример 1 ==================================
const baseColors = createTone((data) => ({
    background: data.main,
    color: data.main,
}));
// Пример 2 ==================================
const brightness = createTone((data) => ({
    foreground: data.main,
    customProp: '#f0f0f0',
}), {
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
});
// Пример 3 ==================================
const depths = createTone((data) => ({
    background: data.light,
    foreground: data.main,
    color: data.extra,
}), {
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
});
// Пример 4 ==================================
const gradients = createTone((data) => ({
    primary: `linear-gradient(45deg, ${data.main}, ${data.light})`,
    secondary: `linear-gradient(135deg, ${data.dark}, ${data.main})`,
    accent: `radial-gradient(circle, ${data.light}, ${data.extra})`,
}), {
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
});
// Пример 5 ==================================
const shadows = createTone((data) => ({
    dropShadow: `0 4px 8px ${data.dark}40`,
    innerShadow: `inset 0 2px 4px ${data.dark}60`,
    glow: `0 0 20px ${data.main}80`,
}), {
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
});
// Пример 6 ==================================
const customTone = createTone((data) => ({
    custom: data.primary,
}));
