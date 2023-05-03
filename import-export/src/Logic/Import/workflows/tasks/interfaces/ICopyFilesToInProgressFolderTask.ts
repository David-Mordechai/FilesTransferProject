export interface ICopyFilesToInProgressFolderTask {
  export copy(
    sourceFolder: string,
    destFolder: string,
    extensionsConfig: Array<string>,
    date: string,
    time: string,
    platform: string,
    tailNumber: string,
    finalFileName: string
  ): void;
}
