import { Formik, Field, Form } from "formik";
import Layout from "../../components/layout";
import { API } from "aws-amplify";

import { createVendor } from "../../src/graphql/mutations.ts";

const CreateVendor = () => {
  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Create Vendor</h3>
        </div>
        <div>
          <Formik
            initialValues={{
              vendorNumber: "",
              companyReportName: "",
              companyListingName: "",
              address1: "",
              address2: "",
              city: "",
              state: "",
              zipCode: "",
              telephoneNum: "",
              attention: "",
              prepayment: false,
              prepaymentAmt: 0,
            }}
            onSubmit={async (values, actions) => {
              await API.graphql({
                query: createVendor,
                variables: {
                  input: {
                    vendorNumber: values.vendorNumber,
                    companyReportName: values.companyReportName,
                    companyListingName: values.companyListingName,
                    address1: values.address1,
                    address2: values.address2,
                    city: values.city,
                    state: values.state,
                    zipCode: values.zipCode,
                    telephoneNum: values.telephoneNum,
                    attention: values.attention,
                    prepayment: values.prepayment,
                    prepaymentAmt: values.prepaymentAmt,
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
                      Vendor Number
                    </label>
                    <Field
                      className="form-input w-full"
                      name="vendorNumber"
                      placeholder="Vendor Number"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2"
                      htmlFor="companyReportName"
                    >
                      Company Report Name
                    </label>

                    <Field
                      className="form-input w-full"
                      name="companyReportName"
                      placeholder="Company Report Name"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2"
                      htmlFor="companyListingName"
                    >
                      Company Listing Name
                    </label>

                    <Field
                      className="form-input w-full"
                      name="companyListingName"
                      placeholder="Company Listing Name"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4 w-full">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2 pr-4"
                      name="address1"
                    >
                      Address 1
                    </label>
                    <Field
                      className="form-input w-full"
                      name="address1"
                      placeholder="999 W Ave North"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="addrress2"
                    >
                      Address 2
                    </label>
                    <Field
                      className="form-input w-full"
                      name="address2"
                      placeholder="Suite 200"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="city"
                    >
                      City
                    </label>
                    <Field
                      className="form-input w-full"
                      name="city"
                      placeholder="Hugoton"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="state"
                    >
                      State
                    </label>
                    <Field
                      className="form-input w-full"
                      name="state"
                      placeholder="Kansas"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="zipCode"
                    >
                      Zip Code
                    </label>
                    <Field
                      className="form-input w-full"
                      name="zipCode"
                      placeholder="67951"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="telephoneNum"
                    >
                      Phone
                    </label>
                    <Field
                      className="form-input w-full"
                      name="telephoneNum"
                      placeholder="620-555-5555"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="attention"
                    >
                      Attention
                    </label>
                    <Field
                      className="form-input w-full"
                      name="attention"
                      placeholder="67951"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="prepayment"
                    >
                      Pre-Payment Y/N
                    </label>
                    <Field
                      className="form-select w-full"
                      name="prepayment"
                      as="select"
                    >
                      <option value={false}>No</option>
                      <option value={true}>Yes</option>
                    </Field>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="prepaymentAmt"
                    >
                      Pre-Payment Amount
                    </label>
                    <Field
                      className="form-input w-full"
                      type="number"
                      name="prepaymentAmt"
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

export default CreateVendor;
