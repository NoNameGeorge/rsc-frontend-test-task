export type ColorsUnion = 'red' | 'green' | 'blue' | 'yellow'
export type ColorData = {
    main: string
    dark: string
    light: string
    extra: string
}

export type InputModel = Record<ColorsUnion, ColorData>

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
    TResult extends Record<string, string>
> = (data: TData) => TResult
export type Subtones<
    TData extends Record<string, string>,
    TResult extends Record<string, string> = Record<string, string>
> = Record<string, ColorTransform<TData, TResult>>
type Tone<
    TData extends Record<string, string>,
    TResult extends Record<string, string> = Record<string, string>,
    TName extends string | undefined = undefined
> = ((data: TData) => TResult) &
    (TName extends string ? { readonly toneName?: TName; readonly subtone?: Subtones<TData> } : {})
export type ToneInstance<
    TData extends Record<string, string>,
    TResult extends Record<string, string> = Record<string, string>,
    TName extends string = string
> = { (data: TData): TResult; readonly toneName?: TName; readonly subtone?: Subtones<TData> }

/**
 * Создает функцию тона
 * @param transform трансформация, создающая новый объект на базе цвета
 * @param options опциональное имя и подтоны, которые будут добавлены к функции
 * @returns функцию тона с дополнительными свойствами при их наличии
 */
function createTone<
    TData extends Record<string, string> = ColorData,
    TResult extends Record<string, string> = Record<string, string>
>(transform: ColorTransform<TData, TResult>): Tone<TData, TResult>

function createTone<
    TData extends Record<string, string> = ColorData,
    TResult extends Record<string, string> = Record<string, string>,
    TName extends string = string,
    TSubtones extends Subtones<TData> = Subtones<TData>
>(
    transform: ColorTransform<TData, TResult>,
    options: { name: TName; subtone: TSubtones }
): { (data: TData): TResult; readonly toneName: TName; readonly subtone: TSubtones }

function createTone<
    TData extends Record<string, string> = ColorData,
    TResult extends Record<string, string> = Record<string, string>,
    TName extends string | undefined = undefined,
    TSubtones extends
        | Record<string, (data: TData) => Record<string, string>>
        | undefined = undefined
>(
    transform: (data: TData) => TResult,
    options?: {
        name: TName
        subtone: TSubtones
    }
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
 * 3.1. Каждый input прогоняем через tone
 * 3.2. Полученный результат записываем как "цвет_имя_тона" (например: "red_brightness")
 * 3.3. Далее прогоняем input через subtone текущего тона
 * 3.4. Полученный результат записываем как "цвет_подтон_имя_тона" (например: "red_low_brightness")
 * 4. Вроде как все, соединяем все в один объект и возвращаем
 */

type UnionToIntersection<U> = (U extends any ? (arg: U) => void : never) extends (
    arg: infer I
) => void
    ? I
    : never

type ToneName<TTone, TKey extends PropertyKey = never> = TTone extends { toneName?: infer TName }
    ? TName extends string
        ? TName
        : Extract<TKey, string>
    : Extract<TKey, string>

type PaletteWithBase<
    TInput extends Record<string, TData>,
    TData extends Record<string, string>,
    TBase extends ToneInstance<TData>
> = { [K in keyof TInput]: TInput[K] & ReturnType<TBase> }

type PaletteWithTones<
    TInput extends Record<string, TData>,
    TData extends Record<string, string> = ColorData,
    TTones extends Record<string, ToneInstance<TData>> = Record<string, ToneInstance<TData>>
> = UnionToIntersection<
    {
        [ColorKey in keyof TInput]: {
            [ToneKey in keyof TTones]: {
                [Key in `${Extract<ColorKey, string>}_${ToneName<
                    TTones[ToneKey],
                    ToneKey
                >}`]: ReturnType<TTones[ToneKey]>
            } & (TTones[ToneKey] extends {
                subtone: infer TSub extends Subtones<TData>
            }
                ? {
                      [SubtoneKey in keyof TSub]: {
                          [Key in `${Extract<ColorKey, string>}_${Extract<
                              SubtoneKey,
                              string
                          >}_${ToneName<TTones[ToneKey], ToneKey>}`]: ReturnType<TSub[SubtoneKey]>
                      }
                  }[keyof TSub]
                : {})
        }[keyof TTones]
    }[keyof TInput]
>

/**
 * Собирает палитру цветов
 * @param input исходные цветовые данные
 * @param options дополнительные преобразования: базовый тон и набор тонов
 * @returns объединенный объект с исходными данными и результатами преобразований
 */
function createPalette<TData extends Record<string, string>, TInput extends Record<string, TData>>(
    input: TInput
): TInput

function createPalette<
    TData extends Record<string, string> = ColorData,
    TInput extends Record<string, TData> = Record<string, TData>,
    TBase extends ToneInstance<TData> = ToneInstance<TData>
>(input: TInput, options: { base: TBase }): PaletteWithBase<TInput, TData, TBase>

function createPalette<
    TData extends Record<string, string> = ColorData,
    TInput extends Record<string, TData> = Record<string, TData>,
    TTones extends Record<string, ToneInstance<TData>> = Record<string, ToneInstance<TData>>
>(input: TInput, options: { tones: TTones }): TInput & PaletteWithTones<TInput, TData, TTones>

function createPalette<
    TInput extends Record<string, TData>,
    TData extends Record<string, string> = ColorData,
    TBase extends ToneInstance<TData> = ToneInstance<TData>,
    TTones extends Record<string, ToneInstance<TData>> = Record<string, ToneInstance<TData>>
>(
    input: TInput,
    options: { base: TBase; tones: TTones }
): PaletteWithBase<TInput, TData, TBase> & PaletteWithTones<TInput, TData, TTones>

function createPalette<
    TData extends Record<string, string>,
    TInput extends Record<string, TData>,
    TBase extends ToneInstance<TData> | undefined = undefined,
    TTones extends Record<string, ToneInstance<TData>> | undefined = undefined
>(
    input: TInput,
    options?: {
        base?: TBase
        tones?: TTones
    }
) {
    type ResultType = TInput &
        (TBase extends ToneInstance<TData> ? PaletteWithBase<TInput, TData, TBase> : {}) &
        (TTones extends Record<string, ToneInstance<TData>>
            ? PaletteWithTones<TInput, TData, TTones>
            : {})

    const result: ResultType = { ...input } as ResultType
    const resultRecord = result as Record<string, unknown>

    if (options?.base) {
        for (const [colorName, colorData] of Object.entries(input)) {
            const baseResult = options.base(colorData)
            resultRecord[colorName] = {
                ...colorData,
                ...baseResult,
            }
        }
    }

    if (options?.tones) {
        for (const [toneKey, tone] of Object.entries(options.tones)) {
            const toneName = tone.toneName ?? toneKey

            for (const [colorName, colorData] of Object.entries(input)) {
                const toneResult = tone(colorData)
                resultRecord[`${colorName}_${toneName}`] = toneResult

                if (tone.subtone) {
                    for (const [subtoneKey, subtoneTransform] of Object.entries(tone.subtone)) {
                        const subtoneResult = subtoneTransform(colorData)
                        resultRecord[`${colorName}_${subtoneKey}_${toneName}`] = subtoneResult
                    }
                }
            }
        }
    }

    return result
}

export { createPalette, createTone }
