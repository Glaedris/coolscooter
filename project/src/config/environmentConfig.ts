import { ConfigModuleOptions } from '@nestjs/config';

const config: ConfigModuleOptions = {
  envFilePath: ['.env.development.local', '.env.development', '.env'],
};
export default config;
