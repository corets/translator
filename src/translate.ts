import { templatize } from "./templatize"
import get from "lodash/get"
import { Translations } from "./types"

export const translate = (
  locales: Translations,
  language: string,
  key: string,
  replacements: any[] = [],
  fallbackLanguage?: string
) => {
  if (language in locales) {
    let translation = get(locales[language], key)

    if (translation === undefined && fallbackLanguage !== undefined) {
      translation = get(locales[fallbackLanguage], key)
    }

    if (typeof translation === "string") {
      return templatize(translation, replacements)
    }
  }

  return `{ ${language}.${key} }`
}
