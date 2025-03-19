// ex. scripts/build_npm.ts
import { build, emptyDir } from '@deno/dnt';

await emptyDir('./npm');

await build({
  entryPoints: ['./src/main.ts'],
  outDir: './npm',
  scriptModule: false,
  test: false,
  typeCheck: false,
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: 'llm-berichtsheft-json',
    version: Deno.args[0],
    description: '',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'https://github.com/issdn/llm-bericht-json.git',
    },
    bugs: {
      url: 'https://github.com/issdn/llm-bericht-json.git/issues',
    },
  },
  postBuild() {},
});
