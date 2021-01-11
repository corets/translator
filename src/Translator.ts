import {
  ObservableTranslator,
  TranslateFunction,
  Translations,
  TranslatorCallback,
} from "./types"
import { translate } from "./translate"
import compact from "lodash/compact"
import merge from "lodash/merge"
import { createValue, ObservableValue } from "@corets/value"

export class Translator implements ObservableTranslator {
  language: ObservableValue<string>
  fallbackLanguage: ObservableValue<string | undefined>
  translations: ObservableValue<Translations>

  constructor(
    translations: Translations,
    language: string,
    fallbackLanguage?: string
  ) {
    this.language = createValue(language)
    this.translations = createValue(translations)
    this.fallbackLanguage = createValue(fallbackLanguage)
  }

  getLanguage(): string {
    return this.language.get()
  }

  setLanguage(language: string): void {
    this.language.set(language)
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
    return this.fallbackLanguage.get()
  }

  setFallbackLanguage(language: string): void {
    this.fallbackLanguage.set(language)
  }

  get(
    key: string,
    replacements?: any[],
    language: string = this.getLanguage()
  ): string {
    return translate(
      this.translations.get(),
      language,
      key,
      replacements,
      this.fallbackLanguage.get()
    )
  }

  has(key: string, language: string = this.getLanguage()): boolean {
    const translation = this.get(key, [], language)

    return translation !== `{ ${language}.${key} }`
  }

  listen(callback: TranslatorCallback, notifyImmediately?: boolean) {
    this.translations.listen(() => callback(this), notifyImmediately)
    this.language.listen(() => callback(this), notifyImmediately)
    this.fallbackLanguage.listen(() => callback(this), notifyImmediately)
  }

  scope(scope: string): TranslateFunction {
    const translate: TranslateFunction = (
      key: string,
      replacements?: any[],
      language?: string
    ) => {
      const path = key.startsWith("~")
        ? key.replace("~", "")
        : compact([scope, key]).join(".")

      return this.get(path, replacements, language)
    }

    return translate
  }
}
