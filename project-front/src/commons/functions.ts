const toCamelCase = (str: string): string => {
  return str
    .split(/[\s_-]+/)
    .map((word: string, index: number) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
};

export { toCamelCase };

//hola mundo
//holaMundo
