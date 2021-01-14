import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { reduxForm, reducer as form } from "redux-form";
import { Row, Col, FormGroup } from "reactstrap";
import { composeWithDevTools } from "redux-devtools-extension";

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
        default: new Date(),
      },
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
