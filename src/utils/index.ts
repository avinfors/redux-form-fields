import { WrappedFieldMetaProps } from "redux-form";

export const getMetaError = ({
  touched,
  dirty,
  error,
  submitFailed,
}: WrappedFieldMetaProps): any => {
  return ((touched || dirty) && error) || (submitFailed && error);
};
