import { Formik, Field, Form } from "formik";
import Layout from "../../components/layout";
import { API, withSSRContext } from "aws-amplify";
import { createCommodity } from "../../src/graphql/mutations.ts";
import { CreateCommoditySchema } from "../../components/validationSchema";
import SubmitButton from "../../components/submitButton";

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
            validationSchema={CreateCommoditySchema}
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
            {({ errors, touched, isSubmitting }) => (
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
                    {errors.name && touched.name ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.name}
                      </div>
                    ) : null}
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
                      className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
                      onClick={() => router.back()}
                      type="button"
                    >
                      Cancel
                    </button>
                    <SubmitButton isSubmitting={isSubmitting}>
                      Submit
                    </SubmitButton>
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

export async function getServerSideProps({ req, res }) {
  const { Auth } = withSSRContext({ req });
  try {
    const user = await Auth.currentAuthenticatedUser();
    return {
      props: {
        authenticated: true,
        username: user.username,
      },
    };
  } catch (err) {
    res.writeHead(302, { Location: "/sign-in" });
    res.end();
    return {
      props: {
        authenticated: false,
      },
    };
  }
}

export default CreateCommodity;
