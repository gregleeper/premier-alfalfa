import { Formik, Field, Form } from "formik";
import Layout from "../../../components/layout";
import { API } from "aws-amplify";
import { updateCommodity } from "../../../src/graphql/mutations.ts";
import { getCommodity } from "../../../src/graphql/queries.ts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreateCommodity;
