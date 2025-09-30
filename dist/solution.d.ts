type ColorsUnion = 'red' | 'green' | 'blue' | 'yellow';
type ColorData = {
    main: string;
    dark: string;
    light: string;
    extra: string;
};
type CustomColorData = {
    primary: string;
    secondary: string;
    tertiary: string;
};
type InputModel = Record<ColorsUnion, ColorData>;
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
type ColorTransform<TData extends Record<string, string>, TResult extends Record<string, string> = Record<string, string>> = (data: TData) => TResult;
type Subtones<TData extends Record<string, string>> = Record<string, ColorTransform<TData>>;
declare function createTone<TData extends Record<string, string> = ColorData, TTransformResult extends Record<string, string> = Record<string, string>>(transform: ColorTransform<TData, TTransformResult>): {
    (data: TData): TTransformResult;
};
declare function createTone<TSubtones extends Subtones<TData>, TName extends string, TData extends Record<string, string> = ColorData, TTransformResult extends Record<string, string> = Record<string, string>>(transform: ColorTransform<TData, TTransformResult>, options: {
    name: TName;
    subtone: TSubtones;
}): {
    (data: TData): TTransformResult;
    toneName: TName;
    subtone: TSubtones;
};
declare const baseColors: (data: ColorData) => {
    background: string;
    color: string;
};
type TBaseColors = typeof baseColors;
declare const brightness: {
    (data: ColorData): {
        foreground: string;
        customProp: string;
    };
    toneName: "brightness";
    subtone: {
        low: (data: ColorData) => {
            white: string;
        };
        medium: (data: ColorData) => {
            shadow: string;
        };
        high: (data: ColorData) => {
            someProp: string;
            anotherProp: string;
            thirdCustomProp: string;
        };
        ultra: (data: ColorData) => {
            intensive: string;
        };
    };
};
type TBrightness = typeof brightness;
declare const depths: {
    (data: ColorData): {
        background: string;
        foreground: string;
        color: string;
    };
    toneName: "depth";
    subtone: {
        '8-bit': (data: ColorData) => {
            borderColor: string;
        };
        '16-bit': (data: ColorData) => {
            borderColor: string;
            anotherColor: string;
        };
        '24-bit': (data: ColorData) => {
            extraColor: string;
        };
    };
};
type TDepths = typeof depths;
declare const gradients: {
    (data: ColorData): {
        primary: string;
        secondary: string;
        accent: string;
    };
    toneName: "gradients";
    subtone: {
        horizontal: (data: ColorData) => {
            leftToRight: string;
        };
        vertical: (data: ColorData) => {
            topToBottom: string;
        };
        diagonal: (data: ColorData) => {
            cornerToCorner: string;
        };
    };
};
type TGradients = typeof gradients;
declare const shadows: {
    (data: ColorData): {
        dropShadow: string;
        innerShadow: string;
        glow: string;
    };
    toneName: "shadows";
    subtone: {
        subtle: (data: ColorData) => {
            lightShadow: string;
        };
        dramatic: (data: ColorData) => {
            heavyShadow: string;
        };
        neon: (data: ColorData) => {
            neonGlow: string;
        };
    };
};
type TShadows = typeof shadows;
declare const customTone: (data: CustomColorData) => {
    custom: string;
};
type TCustomTone = typeof customTone;
