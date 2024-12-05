/* eslint-disable @typescript-eslint/ban-ts-comment */

/** 转换schema,同时去除一些无用字段 */
export function transformSchema(schema: SchemaModel.Schema) {
  try {
    //@ts-ignore
    delete schema.options_bi;
    //@ts-ignore
    delete schema.options_search;
    //@ts-ignore
    delete schema.options_tmpl;
    //@ts-ignore
    delete schema.$type;
    //@ts-ignore
    delete schema.enum_names;

    if (Array.isArray(schema.type)) {
      schema.nullable = schema.type.includes('null');
      schema.type = schema.type[0];
    }

    //兼容初版自定义字段，单选、多选、下拉统一转换Choices
    if (schema.web_type && ['SingleChoice', 'MultiChoice'].includes(schema.web_type)) {
      const choices = (
        schema?.properties?.choices?.enum as unknown as {
          id: string;
          name: string;
          isDeleted: boolean;
        }[]
      )
        ?.filter((item) => !item.isDeleted)
        .map((item) => item.id);
      if (choices?.length) schema.web_type === 'SingleChoice' ? (schema.enum = choices) : (schema.items!.enum = choices);
    }

    if (schema.properties) {
      Object.keys(schema.properties).forEach((key) => {
        schema.properties?.[key] && transformSchema(schema.properties[key]);
      });
    }
    if (schema.items) {
      transformSchema(schema.items);
    }
  } catch (error) {
    console.error(error);
  }
}
