import {
  filterAudioFiles,
  filterDocumentFiles,
  filterImageFiles,
  filterVideoFiles,
  getFileExtension,
  getFileName,
  isAudioFile,
  isDocumentFile,
  isImageFile,
  isVideoFile,
  listTorrentFiles,
} from "@/utils/file"; // Adjust the path as needed

describe("File Utility Functions", () => {
  it("getFileName extracts correct file name", () => {
    expect(getFileName("/path/to/file.mp4")).toBe("file.mp4");
    expect(getFileName("C:\\folder\\document.pdf")).toBe("document.pdf");
  });

  it("getFileExtension extracts correct extension", () => {
    expect(getFileExtension("file.mp4")).toBe("mp4");
    expect(getFileExtension("document.pdf")).toBe("pdf");
    expect(getFileExtension("noextension")).toBe("");
  });

  it("filterVideoFiles filters correctly", () => {
    const files = [{ name: "video.mp4" }, { name: "audio.mp3" }];
    expect(filterVideoFiles(files)).toEqual([{ name: "video.mp4" }]);
  });

  it("isVideoFile identifies correctly", () => {
    expect(isVideoFile("video.mp4")).toBe(true);
    expect(isVideoFile("audio.mp3")).toBe(false);
  });

  it("filterAudioFiles filters correctly", () => {
    const files = [{ name: "video.mp4" }, { name: "audio.mp3" }];
    expect(filterAudioFiles(files)).toEqual([{ name: "audio.mp3" }]);
  });

  it("isAudioFile identifies correctly", () => {
    expect(isAudioFile("audio.mp3")).toBe(true);
    expect(isAudioFile("video.mp4")).toBe(false);
  });

  it("filterImageFiles filters correctly", () => {
    const files = [{ name: "image.png" }, { name: "document.pdf" }];
    expect(filterImageFiles(files)).toEqual([{ name: "image.png" }]);
  });

  it("isImageFile identifies correctly", () => {
    expect(isImageFile("image.png")).toBe(true);
    expect(isImageFile("document.pdf")).toBe(false);
  });

  it("filterDocumentFiles filters correctly", () => {
    const files = [{ name: "image.png" }, { name: "document.pdf" }];
    expect(filterDocumentFiles(files)).toEqual([{ name: "document.pdf" }]);
  });

  it("isDocumentFile identifies correctly", () => {
    expect(isDocumentFile("document.pdf")).toBe(true);
    expect(isDocumentFile("image.png")).toBe(false);
  });

  it("should listTorrentFiles return with extension", () => {
    const mockFiles = [
      {
        path: "test_1.jpg",
        name: "test_1.jpg",
        length: 0,
        offset: 0,
      },
    ];

    const result = listTorrentFiles(mockFiles);
    expect(result?.[0].extension).toBe(".jpg");
  });
});
