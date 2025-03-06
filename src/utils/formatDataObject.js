function formatDataObject(data) {
  let args = { body: data };
  if (args.body) {
    if (args.body instanceof FormData) {
      let newFormData = new FormData();
      for (let key of args.body.keys()) {
        if (
          args.body.get(key) !== null &&
          args.body.get(key) !== "null" &&
          args.body.get(key) !== undefined &&
          args.body.get(key) !== "undefined"
        ) {
          newFormData.append(key, args.body.get(key));
        }
      }
      args.body = newFormData;
    } else if (typeof args.body === "object" && args.body !== null) {
      for (let key in args.body) {
        if (
          args.body[key] === null ||
          args.body[key] === "null" ||
          args.body[key] === undefined ||
          args.body[key] === "undefined"
        ) {
          delete args.body[key];
        }
      }
    }
  }

  return args.body;
}

export default formatDataObject;
