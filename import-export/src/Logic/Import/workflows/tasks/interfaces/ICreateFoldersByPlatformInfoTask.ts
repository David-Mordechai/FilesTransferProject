export interface ICreateFoldersByPlatformInfoTask {
  export create(
    destFolder: string,
    date: string,
    time: string,
    platform: string,
    tailNumber: string
  ): string;
}
