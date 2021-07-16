import { TranslatorPlaceholder } from "./types"

export const translatorPlaceholder: TranslatorPlaceholder = (
  language,
  key,
  replacements
) => `{ ${language}.${key} }`
