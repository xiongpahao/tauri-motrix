import { Instance } from "parse-torrent";

import {
  AUDIO_SUFFIXES,
  DOCUMENT_SUFFIXES,
  IMAGE_SUFFIXES,
  SUB_SUFFIXES,
  VIDEO_SUFFIXES,
} from "@/constant/file";

export const listTorrentFiles = (files: Instance["files"]) => {
  const result = files?.map((file, index) => {
    const extension = getFileExtension(file.path);
    const item = {
      // aria2 select-file start index at 1
      // possible Values: 1-1048576
      idx: index + 1,
      extension: `.${extension}`,
      ...file,
    };
    return item;
  });
  return result;
};

export const getFileName = (fullPath: string) => {
  return fullPath.replace(/^.*[\\/]/, "");
};

export const getFileExtension = (filename: string) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export type FileWithFullName = { name: string };

export const filterVideoFiles = <T extends FileWithFullName>(
  files: T[] = [],
) => {
  const suffix = [...VIDEO_SUFFIXES, ...SUB_SUFFIXES];
  return files.filter((item) => {
    const extension = getFileExtension(item.name);
    return suffix.includes(`.${extension}`);
  });
};

export const isVideoFile = (filename: string) =>
  !!filterVideoFiles([{ name: filename }])[0];

export const filterAudioFiles = <T extends FileWithFullName>(files: T[] = []) =>
  files.filter((item) => {
    const extension = getFileExtension(item.name);
    return AUDIO_SUFFIXES.includes(`.${extension}`);
  });

export const isAudioFile = (filename: string) =>
  !!filterAudioFiles([{ name: filename }])[0];

export const filterImageFiles = <T extends FileWithFullName>(files: T[] = []) =>
  files.filter((item) => {
    const extension = getFileExtension(item.name);
    return IMAGE_SUFFIXES.includes(`.${extension}`);
  });

export const isImageFile = (filename: string) =>
  !!filterImageFiles([{ name: filename }])[0];

export const filterDocumentFiles = <T extends FileWithFullName>(
  files: T[] = [],
) =>
  files.filter((item) => {
    const extension = getFileExtension(item.name);
    return DOCUMENT_SUFFIXES.includes(`.${extension}`);
  });

export const isDocumentFile = (filename: string) =>
  !!filterDocumentFiles([{ name: filename }])[0];
