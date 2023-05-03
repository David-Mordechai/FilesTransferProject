export interface IStructureNameInProgressFilesTask {
  public structureName(
    destFolder: string,
    date: string,
    time: string,
    platform: string,
    tailNumber: string,
    file: string
  ): string;
}
