import { describe, it, expect } from "vitest";

import { isNoticeOption } from "./notice-option";

describe("isNoticeOption", () => {
  it("should return true if the argument is a notice option", () => {
    expect(isNoticeOption("all")).toBe(true);
    expect(isNoticeOption("join-only")).toBe(true);
    expect(isNoticeOption("join-leave")).toBe(true);
  });

  it("should return false if the argument is not a notice option", () => {
    expect(isNoticeOption("")).toBe(false);

    expect(isNoticeOption("All")).toBe(false);
    expect(isNoticeOption("JoinOnly")).toBe(false);
    expect(isNoticeOption("JoinLeave")).toBe(false);

    expect(isNoticeOption("ALL")).toBe(false);
    expect(isNoticeOption("JOIN-ONLY")).toBe(false);
    expect(isNoticeOption("JOIN-LEAVE")).toBe(false);
  });
});
