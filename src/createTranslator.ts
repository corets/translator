import { CreateTranslator } from "./types"
import { Translator } from "./Translator"

export const createTranslator: CreateTranslator = (
  translations,
  language,
  fallbackLanguage
) => {
  return new Translator(translations, language, fallbackLanguage)
}
