import { describe, it, expect } from "vitest";

import { isLanguage } from "./language";

describe("isLanguage", () => {
  it("should return true if the argument is a supported language", () => {
    expect(isLanguage("en")).toBe(true);
    expect(isLanguage("ja")).toBe(true);
  });

  it("should return false if the argument is not a supported language", () => {
    expect(isLanguage("")).toBe(false);
    expect(isLanguage("de")).toBe(false);
  });
});
