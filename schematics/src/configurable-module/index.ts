import { dasherize } from '@angular-devkit/core/src/utils/strings';
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
// Ensure that we are using the same TypeScript version as the schematics
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
interface ConfigurableModuleSchematicOptions {
  name: string;
}

function updateModuleFile(
  tree: Tree,
  options: ConfigurableModuleSchematicOptions,
) {
  const name = dasherize(options.name);
  const modulePath = `src/${name}/${name}.module.ts`;
  const moduleFileContent = tree.readText(modulePath);
  const source = ts.createSourceFile(
    modulePath,
    moduleFileContent,
    ts.ScriptTarget.Latest,
    true,
  );
  const updateRecorder = tree.beginUpdate(modulePath);
  const insertImportChange = insertImport(
    source,
    modulePath,
    'ConfigurableModuleClass',
    `./${name}.module-definition`,
  );
  if (insertImportChange instanceof InsertChange) {
    updateRecorder.insertRight(
      insertImportChange.pos,
      insertImportChange.toAdd,
    );
  }
  tree.commitUpdate(updateRecorder);
  console.log(tree.readText(modulePath));
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
      (tree) => updateModuleFile(tree, options),
    ]);
  };
}
