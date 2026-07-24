import type { ObjectFrom } from './types';

function buildDecomposedMap(
  shape: ObjectFrom<string>,
  val: any,
  decomposedMap: Record<string, any>,
) {
  if (typeof shape === 'string') {
    decomposedMap[shape] = val;
  } else {
    for (const key of Object.keys(shape)) {
      const childShape = shape[key];
      const childVal = val?.[key];
      buildDecomposedMap(childShape, childVal, decomposedMap);
    }
  }
}

export const buildMap = (map: any[], newArgs: any[]): any => {
  const decomposedMap = {};

  map.forEach((shape, index) => {
    const val = newArgs[index];
    buildDecomposedMap(shape, val, decomposedMap);
  });

  return decomposedMap;
};
