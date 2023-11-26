import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';

export function EntityExistsPipe(entityCls: Type): Type<PipeTransform> {
  @Injectable()
  class EntityExistsPipeCls implements PipeTransform {
    constructor(
      @Inject(entityCls)
      private readonly entityRepository: {
        exists(condition: unknown): Promise<void>;
      },
    ) {}

    async transform(value: any, metadata: ArgumentMetadata) {
      console.log(value);
      console.log(metadata);

      // example method that throws if entity does not exist
      await this.entityRepository.exists({ where: { id: value } });
      return value;
    }
  }
  return EntityExistsPipeCls;
}
