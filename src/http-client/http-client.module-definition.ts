import { ConfigurableModuleBuilder } from '@nestjs/common';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: HTTP_MODULE_OPTIONS, // Rename MODULE_OPTIONS_TOKEN so it's not ambiguous
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<{
  baseUrl?: string;
  // }>({ alwaysTransient: true })
}>({ alwaysTransient: true })
  .setClassMethodName('forRoot')
  // Set extra configuration options for the module itself
  .setExtras<{ isGlobal?: boolean }>(
    { isGlobal: true },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .build();
