import { describe, it, expect } from "vitest";

import { isNotifiableVCActions, vcAction } from "./vc-action";

describe("isNotifiableVCActions", () => {
  it("should return true if the argument is a notifiable VC action", () => {
    expect(isNotifiableVCActions(vcAction.JoinChannel)).toBe(true);
    expect(isNotifiableVCActions(vcAction.MoveChannel)).toBe(true);
    expect(isNotifiableVCActions(vcAction.JoinAfkChannel)).toBe(true);
    expect(isNotifiableVCActions(vcAction.LeaveChannel)).toBe(true);
    expect(isNotifiableVCActions(vcAction.StartStreaming)).toBe(true);
    expect(isNotifiableVCActions(vcAction.EndStreaming)).toBe(true);
    expect(isNotifiableVCActions(vcAction.StartVideo)).toBe(true);
    expect(isNotifiableVCActions(vcAction.EndVideo)).toBe(true);
  });

  it("should return false if the argument is not a notifiable VC action", () => {
    expect(isNotifiableVCActions(vcAction.StartSelfMute)).toBe(false);
    expect(isNotifiableVCActions(vcAction.EndSelfMute)).toBe(false);
    expect(isNotifiableVCActions(vcAction.StartServerMute)).toBe(false);
    expect(isNotifiableVCActions(vcAction.EndServerMute)).toBe(false);
    expect(isNotifiableVCActions(vcAction.StartSelfDeaf)).toBe(false);
    expect(isNotifiableVCActions(vcAction.EndSelfDeaf)).toBe(false);
    expect(isNotifiableVCActions(vcAction.StartServerDeaf)).toBe(false);
    expect(isNotifiableVCActions(vcAction.EndServerDeaf)).toBe(false);
  });
});
