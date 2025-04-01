const addToPipeline = (
  queries: (string | undefined)[],
  fieldsArray: string[]
): object => {
  const conditions = queries.reduce((acc, query, index) => {
    acc.push({
      isDeleted: false,
    });
    if (query) {
      if (fieldsArray[index] === "status") {
        acc.push({
          [fieldsArray[index]]: { $regex: `^${query}$`, $options: "i" },
        });
      } else {
        acc.push({
          [fieldsArray[index]]: { $regex: query, $options: "i" },
        });
      }
    }

    return acc;
  }, [] as object[]);

  if (conditions.length === 0) {
    return { $match: {} };
  }

  return { $match: { $or: conditions } };
};

export default addToPipeline;
