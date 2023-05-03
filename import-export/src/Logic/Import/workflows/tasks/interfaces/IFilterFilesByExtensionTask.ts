export interface IFilterFilesByExtensionTask {
  export filterList(files: string[], extensionsConfig: Array<string>): string[];
}
