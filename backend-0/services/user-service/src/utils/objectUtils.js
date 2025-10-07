// Object utility functions

// Filter object to only include allowed fields
const filterObject = (obj, allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

// Remove undefined values from object
const removeUndefined = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

// Deep merge two objects
const deepMerge = (target, source) => {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

// Check if value is an object
const isObject = (item) => {
  return item && typeof item === "object" && !Array.isArray(item);
};

// Convert dot notation to nested object
const expandObject = (obj) => {
  const result = {};

  for (let key in obj) {
    const keys = key.split(".");
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = obj[key];
  }

  return result;
};

module.exports = {
  filterObject,
  removeUndefined,
  deepMerge,
  isObject,
  expandObject,
};
