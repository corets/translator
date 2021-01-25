import {
  ObservableTranslator,
  TranslateFunction,
  TranslatorGetOptions,
  Translations,
  TranslatorCallback,
  TranslatorConfig,
  TranslatorHasOptions,
  TranslateFunctionFactoryOptions,
  TranslatorReplacements,
  TranslatorOptions,
  TranslatorFormatter,
  TranslatorInterpolator,
} from "./types"
import { compact, get, merge } from "lodash-es"
import { createValue, ObservableValue } from "@corets/value"
import { interpolator } from "./interpolator"
import { formatter } from "./formatter"
import { placeholder } from "./placeholder"

export class Translator implements ObservableTranslator {
  configuration: ObservableValue<TranslatorConfig>
  translations: ObservableValue<Translations>

  constructor(translations: Translations, options: TranslatorOptions) {
    this.configuration = createValue({
      language: options.language,
      fallbackLanguage: options?.fallbackLanguage,
      templatize: options?.templatize ?? true,
      formatter: options?.formatter ?? formatter,
      interpolator: options?.interpolator ?? interpolator,
      placeholder: options?.placeholder ?? placeholder,
    })

    this.translations = createValue(translations)
  }

  getLanguage(): string {
    return this.configuration.get().language
  }

  setLanguage(language: string): void {
    this.configuration.set({ ...this.configuration.get(), language })
  }

  getLanguages(): string[] {
    return Object.keys(this.getTranslations())
  }

  getTranslations(): Translations {
    return this.translations.get()
  }

  getTranslationsForLanguage(language: string): object {
    return this.getTranslations()[language] || {}
  }

  setTranslations(translations: Translations): void {
    this.translations.set(translations)
  }

  setTranslationsForLanguage(language: string, translations: object): void {
    this.setTranslations({
      ...this.getTranslations(),
      [language]: translations,
    })
  }

  addTranslations(translations: Translations): void {
    this.setTranslations(merge({}, this.getTranslations(), translations))
  }

  addTranslationsForLanguage(language: string, translations: object): void {
    this.addTranslations({ [language]: translations })
  }

  getFallbackLanguage(): string | undefined {
    return this.configuration.get().fallbackLanguage
  }

  setFallbackLanguage(fallbackLanguage: string): void {
    this.configuration.set({ ...this.configuration.get(), fallbackLanguage })
  }

  getFormatter(): TranslatorFormatter {
    return this.configuration.get().formatter
  }

  setFormatter(formatter: TranslatorFormatter) {
    this.configuration.set({ ...this.configuration.get(), formatter })
  }

  getInterpolator(): TranslatorInterpolator {
    return this.configuration.get().interpolator
  }

  setInterpolator(interpolator: TranslatorInterpolator) {
    this.configuration.set({ ...this.configuration.get(), interpolator })
  }

  config(configuration: Partial<TranslatorConfig>) {
    this.configuration.set({ ...this.configuration.get(), ...configuration })
  }

  get(key: string, options?: TranslatorGetOptions): string {
    const language = options?.language ?? this.getLanguage()
    const fallbackLanguage =
      options?.fallbackLanguage ?? this.getFallbackLanguage()
    const replacements = this.parseReplacements(options?.replace ?? {})
    const templatize =
      options?.templatize ?? this.configuration.get().templatize
    const formatter = options?.formatter ?? this.configuration.get().formatter
    const interpolator =
      options?.interpolator ?? this.configuration.get().interpolator

    let template = get(this.getTranslationsForLanguage(language), key)

    if (
      template === undefined &&
      fallbackLanguage !== undefined &&
      fallbackLanguage !== language
    ) {
      template = get(this.getTranslationsForLanguage(fallbackLanguage), key)
    }

    if (typeof template === "string") {
      if (templatize) {
        return this.templatize(
          language,
          template,
          replacements,
          interpolator,
          formatter
        )
      }

      return template
    }

    return this.configuration.get().placeholder(language, key, replacements)
  }

  has(key: string, options?: TranslatorHasOptions): boolean {
    const translation = this.get(key, { templatize: false, ...options })
    const language = options?.language ?? this.getLanguage()

    return (
      translation != this.configuration.get().placeholder(language, key, {})
    )
  }

  listen(callback: TranslatorCallback, notifyImmediately?: boolean) {
    this.translations.listen(() => callback(this), notifyImmediately)
    this.configuration.listen(() => callback(this), notifyImmediately)
  }

  t(options?: TranslateFunctionFactoryOptions): TranslateFunction {
    const translate: TranslateFunction = (
      key: string,
      optionsOverride?: TranslatorGetOptions
    ) => {
      const scope = options?.scope

      key = key.startsWith("~")
        ? key.replace("~", "")
        : compact([scope, key]).join(".")

      return this.get(key, { ...options, ...optionsOverride })
    }

    return translate
  }

  protected templatize(
    language: string,
    template: string,
    replacements: Record<any, any>,
    interpolator: TranslatorInterpolator,
    formatter: TranslatorFormatter
  ) {
    const text = Object.keys(replacements).reduce((template, match) => {
      const replacement = formatter(language, replacements[match], replacements)

      return interpolator(template, match, replacement)
    }, template)

    return text
  }

  protected parseReplacements(
    replacements: TranslatorReplacements
  ): Record<any, any> {
    if (Array.isArray(replacements)) {
      replacements = Object.fromEntries(
        replacements.map((value, index) => [index + 1, value])
      )
    }

    return replacements
  }
}
