export interface ICopyFilesToBackupFolderTask {
  export copy(sourceFolder: string, destFolder: string): void;
}
