import ErrorResponseFactory from "../error/ErrorResponseFactory";

type field = string | number;

export default (fields: field[]): void => {
  try {
    fields.forEach((field) => {
      if (`${field}`.trim() == "")
        throw new ErrorResponseFactory("Some field wasn't filled !", 400);
    });
  } catch (e) {
    throw e;
  }
};
