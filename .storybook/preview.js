import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { reduxForm, reducer as form } from "redux-form";
import { Row, Col, FormGroup } from "reactstrap";
import { composeWithDevTools } from "redux-devtools-extension";
import addDays from "date-fns/addDays";
import startOfDay from "date-fns/startOfDay";

import "./styles.scss";

const rootReducer = combineReducers({ form });
const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware())
);
const withReduxForm = (Story) => {
  const Form = reduxForm({
    form: "reduxForm",
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: false,
    initialValues: {
      textField: {
        readOnly: "Read-only content",
      },
      dateField: {
        withMinAndMaxDates: addDays(startOfDay(new Date()), -8),
      },
    },
    validate: (values) => {
      const errors = {};
      if (Object.keys(values).length === 0) {
        return {};
      }
      const { withMinAndMaxDates } = values.dateField;
      if (typeof withMinAndMaxDates === "string") {
        errors.dateField = {};
        errors.dateField.withMinAndMaxDates = withMinAndMaxDates;
      }
      return errors;
    },
  })(Story);
  return (
    <Provider store={store}>
      <Row form>
        <Col md={6}>
          <FormGroup>
            <Form />
          </FormGroup>
        </Col>
      </Row>
    </Provider>
  );
};

export const decorators = [withReduxForm];
