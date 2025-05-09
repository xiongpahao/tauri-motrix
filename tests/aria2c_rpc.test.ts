import { invoke } from "@tauri-apps/api/core";
import { mockIPC } from "@tauri-apps/api/mocks";

beforeAll(() => {
  mockIPC((cmd) => {
    if (cmd === "get_aria2_info") {
      return {
        port: 16801,
        server: "http://127.0.0.1:16801",
      };
    }
  });
});

describe("getAria2 fn", () => {
  it("should invoke get_aria2_info", () => {
    // getAria2();
    const expectObj = {
      port: 16801,
      server: "http://127.0.0.1:16801",
    };
    expect(invoke("get_aria2_info")).resolves.toEqual(expectObj);
  });

  it("should call getAria2", async () => {
    // why call it now?
    // because the aria2c_api file called invoke in first.
    const { getAria2 } = await import("@/services/aria2c_api");

    // @ts-expect-error jest runtime
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      }),
    );
    const instance = await getAria2();

    expect(instance).toBeDefined();
  });

  it("should call aria2 version", async () => {
    const { getAria2 } = await import("@/services/aria2c_api");

    const getVersionData = {
      enabledFeatures: [
        "Async DNS",
        "BitTorrent",
        "Firefox3 Cookie",
        "GZip",
        "HTTPS",
        "Message Digest",
        "Metalink",
        "XML-RPC",
        "SFTP",
      ],
      version: "1.37.0",
    };

    // @ts-expect-error get aria2 version
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ result: getVersionData }),
      }),
    );

    const { call } = await getAria2();

    expect(call("aria2.getVersion")).resolves.toEqual(getVersionData);
  });
});

describe("Aria2 api", () => {});
