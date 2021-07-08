import { createTranslator } from "./createTranslator"
import { createTranslatorAccessor } from "./createTranslatorAccessor"

describe("createTranslatorAccessor", () => {
  it("creates translator accessor", () => {
    const en = { foo: { bar: { yolo: "swag {{i}}" } }, ping: "pong" }
    const de = { ping: "pang" }

    const translator = createTranslator({ en, de }, { language: "en" })
    const accessor = createTranslatorAccessor(translator, en)

    expect(accessor).toBeDefined()
    expect(accessor.ping.get()).toBe("pong")
    expect(accessor.ping.get({ language: "de" })).toBe("pang")
    expect(accessor.foo.bar.yolo.get({ replace: { i: "!" } })).toBe("swag !")
  })
})
