import { Formik, Field, Form } from "formik";
import Layout from "../../components/layout";
import { API, withSSRContext } from "aws-amplify";
import { useRouter } from "next/router";
import { createVendor } from "../../src/graphql/mutations.ts";
import { CreateVendorSchema } from "../../components/validationSchema";

const CreateVendor = () => {
  const router = useRouter();
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
            validationSchema={CreateVendorSchema}
            onSubmit={async (values, actions) => {
              console.log("submitting");
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
            {({ isSubmitting, errors, touched, values }) => (
              <Form>
                {console.log(errors)}
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
                    {errors.vendorNumber && touched.vendorNumber ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.vendorNumber}
                      </div>
                    ) : null}
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
                    {errors.companyReportName && touched.companyReportName ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.companyReportName}
                      </div>
                    ) : null}
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
                    {errors.companyListingName && touched.companyListingName ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.companyListingName}
                      </div>
                    ) : null}
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
                    {errors.address1 && touched.address1 ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.address1}
                      </div>
                    ) : null}
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
                    {errors.address2 && touched.address2 ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.address2}
                      </div>
                    ) : null}
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
                    {errors.city && touched.city ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.city}
                      </div>
                    ) : null}
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
                    {errors.state && touched.state ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.state}
                      </div>
                    ) : null}
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
                    {errors.zipCode && touched.zipCode ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.zipCode}
                      </div>
                    ) : null}
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
                    {errors.telephoneNum && touched.telephoneNum ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.telephoneNum}
                      </div>
                    ) : null}
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
                      placeholder="John Doe"
                    />
                    {errors.attention && touched.dateSigned ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.dateSigned}
                      </div>
                    ) : null}
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
                    {errors.prepayment && touched.dateSigned ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.dateSigned}
                      </div>
                    ) : null}
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
                    {errors.prepaymentAmt && touched.prepaymentAmt ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.prepaymentAmt}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex justify-center mt-12">
                    <button
                      className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
                      onClick={() => router.back()}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
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

export async function getServerSideProps({ req, res }) {
  const { Auth } = withSSRContext({ req });
  try {
    const user = await Auth.currentAuthenticatedUser();
    console.log(user.signInUserSession.accessToken.payload);
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

export default CreateVendor;
