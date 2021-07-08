import { CreateTranslatorAccessor } from "./types"
import { createAccessor } from "@corets/accessor"

export const createTranslatorAccessor: CreateTranslatorAccessor = (
  translator,
  translations
) =>
  createAccessor(translations, (source, key, args) =>
    translator.get(key as string, args)
  )
