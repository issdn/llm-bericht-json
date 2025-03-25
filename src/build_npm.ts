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
    author: 'karol.bielski@gmx.de',
    private: true,
    license: 'MIT',
    main: 'esm/main.js',
    types: 'esm/main.d.ts',
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
