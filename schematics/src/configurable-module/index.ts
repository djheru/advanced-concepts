import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic,
} from '@angular-devkit/schematics';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function generate(_options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      externalSchematic('@nestjs/schematics', 'module', {
        name: 'placeholder',
      }),
    ]);
  };
}
