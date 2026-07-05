import { FileNode } from "../types";

export const pickDirectory = async (): Promise<FileNode | null> => {
  if ('showDirectoryPicker' in window) {
    try {
      // @ts-ignore
      const handle = await window.showDirectoryPicker();
      return {
        name: handle.name,
        kind: 'directory',
        handle: handle,
        path: handle.name,
        children: []
      };
    } catch (e) {
      console.error("FS Access denied or cancelled", e);
      return null;
    }
  } else {
    alert("Browser does not support File System Access API (Use Chrome/Edge).");
    return null;
  }
};

export const readDirectory = async (directoryNode: FileNode): Promise<FileNode[]> => {
  const children: FileNode[] = [];
  // @ts-ignore
  for await (const entry of directoryNode.handle.values()) {
    children.push({
      name: entry.name,
      kind: entry.kind,
      handle: entry,
      path: `${directoryNode.path}/${entry.name}`,
    });
  }
  return children.sort((a, b) => {
    if (a.kind === b.kind) return a.name.localeCompare(b.name);
    return a.kind === 'directory' ? -1 : 1;
  });
};

export const readFileContent = async (fileNode: FileNode): Promise<string> => {
  if (fileNode.kind !== 'file') return "";
  try {
    // @ts-ignore
    const file = await fileNode.handle.getFile();
    return await file.text();
  } catch (e) {
    console.error("Failed to read file", e);
    return "[ERROR: Cannot read file content]";
  }
};
