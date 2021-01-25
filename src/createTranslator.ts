import { CreateTranslator } from "./types"
import { Translator } from "./Translator"

export const createTranslator: CreateTranslator = (translations, options) => {
  return new Translator(translations, options)
}
