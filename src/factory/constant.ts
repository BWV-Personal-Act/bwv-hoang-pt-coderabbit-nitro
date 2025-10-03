interface Messages {
  alreadyExist: (field: string) => string;
  invalidDateFormat: (format: string) => string;
}

export const messages: Messages = {
  alreadyExist: (field: string) => `${field} already exists`,
  invalidDateFormat: (format: string) => `Date must be in ${format} format`,
};
