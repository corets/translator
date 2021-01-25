import { createTranslator, Translator } from "./index"

describe("createTranslator", () => {
  it("creates translator", () => {
    const translator = createTranslator(
      { en: { foo: "bar" } },
      { language: "en", fallbackLanguage: "de" }
    )

    expect(translator instanceof Translator)
    expect(translator.translations.get()).toEqual({ en: { foo: "bar" } })
    expect(translator.getLanguage()).toBe("en")
    expect(translator.getFallbackLanguage()).toBe("de")
  })
})
