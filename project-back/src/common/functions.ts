const deepParseJson = (obj: any): any => {
  if (typeof obj === 'string') {
    try {
      const parsed = JSON.parse(obj);
      return deepParseJson(parsed); // Recursively parse if it's still an object
    } catch (e) {
      return obj; // Return as-is if not a valid JSON string
    }
  } else if (Array.isArray(obj)) {
    return obj.map(deepParseJson); // Recursively parse each element in an array
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, deepParseJson(value)]),
    );
  }
  return obj;
};

export { deepParseJson };
