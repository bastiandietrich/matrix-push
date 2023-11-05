import { parse } from 'yaml'
import { AppConfiguration } from '../interfaces';

const readYAML = (path: string) => Bun.file(path).text().then(text => parse(text));

const getConfiguration = async () => {
  // read configuration from environment path or default path
  const file: Partial<AppConfiguration> = await readYAML(process.env.CONFIGURATION ?? 'config.yaml').catch(_ => {});

  // use default settings
  return {
    server: {
      port: 3000
    },
    provider: [],
    ...file,
  };
};

export {readYAML, getConfiguration};
