import { Formik, Field, Form } from "formik";
import Layout from "../../../components/layout";
import { API, withSSRContext } from "aws-amplify";
import { updateCommodity } from "../../../src/graphql/mutations.ts";
import { getCommodity } from "../../../src/graphql/queries.ts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CreateCommoditySchema } from "../../../components/validationSchema";
import SubmitButton from "../../../components/submitButton";

const CreateCommodity = () => {
  const router = useRouter();
  const { id } = router.query;
  const [commodity, setCommodity] = useState();

  const getMyCommodity = async () => {
    const {
      data: { getCommodity: myCommodity },
    } = await API.graphql({
      query: getCommodity,
      variables: {
        id,
      },
    });
    setCommodity(myCommodity);
  };
  useEffect(() => {
    getMyCommodity();
  }, [id]);

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Edit Commodity</h3>
        </div>
        <div>
          {commodity && (
            <Formik
              initialValues={{
                name: (commodity && commodity.name) || "",
                calculateCode: (commodity && commodity.calculateCode) || 3,
                billingCode: (commodity && commodity.billingCode) || 3,
                poundsPerBushel: (commodity && commodity.poundsPerBushel) || 0,
              }}
              validationSchema={CreateCommoditySchema}
              onSubmit={async (values) => {
                await API.graphql({
                  query: updateCommodity,
                  variables: {
                    input: {
                      id,
                      name: values.name,
                      calculateCode: values.calculateCode,
                      billingCode: values.billingCode,
                      poundsPerBushel: values.poundsPerBushel,
                    },
                  },
                });
                router.back();
              }}
            >
              {({ isSubmitting, errors, touched }) => (
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
          )}
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
