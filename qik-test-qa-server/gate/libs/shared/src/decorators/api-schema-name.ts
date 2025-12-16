export const ApiSchemaName = (name: string) => {
  return (constructor: any) => {
    const wrapper: any = class extends constructor {};
    Object.defineProperty(wrapper, 'name', {
      value: name,
      writable: false,
    });
    return wrapper;
  };
};
