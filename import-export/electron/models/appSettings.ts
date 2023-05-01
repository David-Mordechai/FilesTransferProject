export interface appSettings {
  localRootFolder: string;
  platforms: [];
  allowedFiles: allowedFiles[];
}

export interface allowedFiles {
  name: string;
  extentions: [];
}
