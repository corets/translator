import { CreateTranslator } from "./types"
import { Translator } from "./Translator"

export const createTranslator: CreateTranslator = (translations, options) =>
  new Translator(translations, options)
