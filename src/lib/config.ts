import { type } from "os";
import { accessSync, mkdirSync } from "fs";
export function getConfigDirectory() {
  switch (type().toLowerCase()) {
    case "linux":
      const base = process.env.XDG_CONFIG_HOME ?? `${process.env.HOME}/.config`;
      return `${base}/classcharts-cli`;
    case "darwin":
      return `${process.env.HOME}/Library/Application Support/classcharts-cli`;
    case "windows_nt":
      return `${process.env.APPDATA}/classcharts-cli`;
    default:
      throw new Error("Unsupported platform");
  }
}

export function createConfigDirectory() {
  const configDirectory = getConfigDirectory();
  if (exists(configDirectory)) return configDirectory;
  mkdirSync(configDirectory, { recursive: false });
  return configDirectory;
}

export function exists(path: string) {
  try {
    accessSync(path);
  } catch {
    return false;
  }
  return true;
}
