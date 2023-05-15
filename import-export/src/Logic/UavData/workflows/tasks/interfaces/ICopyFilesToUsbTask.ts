export interface ICopyFilesToUsbTask {
  public copy(path: string, destFolder: string): void;
}
