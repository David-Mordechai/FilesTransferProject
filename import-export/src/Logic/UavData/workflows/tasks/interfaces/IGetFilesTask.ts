export interface IGetFilesTask {
  public get(sourceFolder: string): Promise<string[]>;
}
