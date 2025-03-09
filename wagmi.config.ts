import { defineConfig } from '@wagmi/cli';
import { foundry } from '@wagmi/cli/plugins';

export default defineConfig([
  {
    out: 'src/lib/web3/generated/subsub.ts',
    contracts: [],
    plugins: [
      foundry({
        forge: {
          path: 'some/dummy',
          build: false,
          rebuild: false
        },
        artifacts: 'node_modules/@createz/contracts/out'
      })
    ]
  }
]);
