import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  externalSchematic,
  mergeWith,
  move,
  strings,
  template,
  url,
} from '@angular-devkit/schematics';

interface ConfigurableModuleSchematicOptions {
  name: string;
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function generate(options: ConfigurableModuleSchematicOptions): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      template({ ...options, ...strings }),
      move('src'),
    ]);
    return chain([
      externalSchematic('@nestjs/schematics', 'module', {
        name: options.name,
      }),
      mergeWith(templateSource),
    ]);
  };
}
