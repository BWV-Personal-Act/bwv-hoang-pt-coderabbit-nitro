interface Messages {
  alreadyExist: (field: string) => string;
  notFound: (field: string) => string;
  invalidDateFormat: (format: string) => string;
}

export const messages: Messages = {
  alreadyExist: (field: string) => `${field} already exists`,
  notFound: (field: string) => `${field} does not exist`,
  invalidDateFormat: (format: string) => `Date must be in ${format} format`,
};
