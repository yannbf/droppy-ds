import { writeFile } from 'node:fs/promises'
import path from 'node:path'

export interface Manifest {
  branchName: string
  baseCommit: string
  keptFacets: string[]
  createdAt: string
  version: number
  /** When true, .storybook/main.ts strips all generated docgen from the branch's build. */
  purgeAllDocgen: boolean
}

export function buildManifest(args: {
  branchName: string
  baseCommit: string
  keptFacets: string[]
  createdAt: string
  version: number
  purgeAllDocgen: boolean
}): Manifest {
  return {
    branchName: args.branchName,
    baseCommit: args.baseCommit,
    keptFacets: [...args.keptFacets].sort(),
    createdAt: args.createdAt,
    version: args.version,
    purgeAllDocgen: args.purgeAllDocgen,
  }
}

export async function writeManifest(cwd: string, manifest: Manifest): Promise<string> {
  const filePath = path.join(cwd, 'experiment.json')
  await writeFile(filePath, `${JSON.stringify(manifest, null, 2)}\n`)
  return filePath
}
