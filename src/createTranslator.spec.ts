import { createTranslator, Translator } from "./index"

describe("createTranslator", () => {
  it("creates translator", () => {
    const translator = createTranslator({ en: { foo: "bar" } }, "en", "de")

    expect(translator instanceof Translator)
    expect(translator.translations.get()).toEqual({ en: { foo: "bar" } })
    expect(translator.language.get()).toBe("en")
    expect(translator.fallbackLanguage.get()).toBe("de")
  })
})
