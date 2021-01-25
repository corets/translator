import { TranslatorPlaceholder } from "./types"

export const placeholder: TranslatorPlaceholder = (
  language,
  key,
  replacements
) => {
  return `{ ${language}.${key} }`
}
