export interface ICopyFilesToInProgressFolderTask {
  public copy(finalFileName: string, destFolder: string, file: string): void;
}
