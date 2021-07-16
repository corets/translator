import { ObservableValue } from "@corets/value"
import { ObjectAccessor } from "@corets/accessor"

export type Translations = { [K: string]: object }

export type CreateTranslator = (
  translations: Translations,
  options: TranslatorOptions
) => ObservableTranslator

export type CreateTranslatorAccessor = <TTranslations extends object>(
  translator: ObservableTranslator,
  translations: TTranslations
) => ObjectAccessor<TTranslations, string, [TranslatorGetOptions?]>

export type TranslatorConfig = {
  language: string
  fallbackLanguage?: string
  interpolate: boolean
  debounceChanges: number
  interpolator: TranslatorInterpolator
  formatter: TranslatorFormatter
  placeholder: TranslatorPlaceholder
}

export type TranslatorOptions = {
  language: string
  fallbackLanguage?: string
  interpolate?: boolean
  debounceChanges?: number
  interpolator?: TranslatorInterpolator
  formatter?: TranslatorFormatter
  placeholder?: TranslatorPlaceholder
}

export type TranslatorGetOptions = {
  replace?: TranslatorReplacements
  language?: string
  fallbackLanguage?: string
  interpolate?: boolean
  formatter?: TranslatorFormatter
  interpolator?: TranslatorInterpolator
}

export type TranslatorHasOptions = {
  language?: string
  fallbackLanguage?: string
}

export type TranslatorReplacements = any[] | Record<any, any>

export type TranslatorInterpolator = (
  text: string,
  match: string,
  replacement: string
) => string

export type TranslatorFormatter = (
  language: string,
  replacement: any,
  otherReplacements: Record<any, any>
) => string

export type TranslatorPlaceholder = (
  language: string,
  key: string,
  replacements: Record<any, any>
) => string

export type TranslatorCallback = (translator: ObservableTranslator) => void
export type TranslatorCallbackUnsubscribe = () => void

export type TranslateFunction = (
  key: string,
  options?: TranslatorGetOptions
) => string

export type TranslateFunctionFactoryOptions = {
  scope?: string
  language?: string
  fallbackLanguage?: string
  interpolate?: boolean
  formatter?: TranslatorFormatter
  interpolator?: TranslatorInterpolator
}

export interface ObservableTranslator {
  translations: ObservableValue<Translations>
  configuration: ObservableValue<TranslatorConfig>

  getLanguage(): string
  setLanguage(language: string): void
  getLanguages(): string[]
  getFallbackLanguage(): string | undefined
  setFallbackLanguage(fallbackLanguage: string): void
  getTranslations(): Translations
  getTranslationsForLanguage(language: string): object
  setTranslations(translations: Translations): void
  setTranslationsForLanguage(language: string, translations: object): void
  addTranslations(translations: Translations): void
  addTranslationsForLanguage(language: string, translations: object): void
  getFormatter(): TranslatorFormatter
  setFormatter(formatter: TranslatorFormatter): void
  getInterpolator(): TranslatorInterpolator
  setInterpolator(interpolator: TranslatorInterpolator)
  config(configuration: Partial<TranslatorConfig>): void

  get(key: string, options?: TranslatorGetOptions): string
  has(key: string, options?: TranslatorHasOptions): boolean

  listen(
    callback: TranslatorCallback,
    options?: TranslatorListenOptions
  ): TranslatorCallbackUnsubscribe
  t(options?: TranslateFunctionFactoryOptions): TranslateFunction
}

export type TranslatorListenOptions = {
  immediate?: boolean
}
