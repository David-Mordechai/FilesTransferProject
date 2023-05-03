import fs from "fs/promises";
import path from "path";

export default async function getFilesRecursive(directory: string): string[] {
  let fileList: string[] = [];

  const files = await fs.readdir(directory);
  for (const file of files) {
    const p = path.join(directory, file);
    if ((await fs.stat(p)).isDirectory()) {
      fileList = [...fileList, ...(await getFilesRecursive(p))];
    } else {
      fileList.push(p);
    }
  }

  return fileList;
}
