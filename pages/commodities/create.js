import { Formik, Field, Form } from "formik";
import Layout from "../../components/layout";
import { API } from "aws-amplify";
import { createCommodity } from "../../src/graphql/mutations.ts";

const CreateCommodity = () => {
  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Create Commodity</h3>
        </div>
        <div>
          <Formik
            initialValues={{
              name: "",
              calculateCode: 3,
              billingCode: 3,
              poundsPerBushel: 0,
            }}
            onSubmit={async (values, actions) => {
              await API.graphql({
                query: createCommodity,
                variables: {
                  input: {
                    name: values.name,
                    calculateCode: values.calculateCode,
                    billingCode: values.billingCode,
                    poundsPerBushel: values.poundsPerBushel,
                  },
                },
              });
              actions.resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="w-7/12 mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <Field
                      className="form-input w-full"
                      name="name"
                      placeholder="Alfalfa"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2"
                      htmlFor="calculateCode"
                    >
                      Calculate Code
                    </label>

                    <Field
                      className="form-input w-full"
                      name="calculateCode"
                      type="number"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2"
                      htmlFor="billingCode"
                    >
                      Billing Code
                    </label>

                    <Field
                      className="form-input w-full"
                      name="billingCode"
                      type="number"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4 w-full">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2 pr-4"
                      name="poundsPerBushel"
                    >
                      Pounds Per Bushel
                    </label>
                    <Field
                      className="form-input w-full"
                      name="poundsPerBushel"
                    />
                  </div>

                  <div className="flex justify-center mt-12">
                    <button
                      className="border border-blue-400 bg-blue-500 text-white py-2 px-4 rounded-lg"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCommodity;
