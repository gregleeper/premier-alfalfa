import Layout from "../../../components/layout";
import { useRouter } from "next/router";
import { getVendor } from "../../../src/graphql/queries.ts";
import { updateVendor } from "../../../src/graphql/mutations.ts";
import { API, withSSRContext } from "aws-amplify";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
const EditVendor = () => {
  const router = useRouter();
  const { id } = router.query;
  const [vendor, setVendor] = useState();

  const getMyVendor = async () => {
    const {
      data: { getVendor: myVendor },
    } = await API.graphql({
      query: getVendor,
      variables: {
        id,
      },
    });
    setVendor(myVendor);
  };

  useEffect(() => {
    getMyVendor();
  }, [id]);

  return (
    <Layout>
      <div className="px-6">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Edit Vendor</h3>
        </div>
        <div>
          {vendor && (
            <Formik
              initialValues={{
                vendorNumber: (vendor && vendor.vendorNumber) || "",
                companyReportName: (vendor && vendor.companyReportName) || "",
                companyListingName: (vendor && vendor.companyListingName) || "",
                address1: (vendor && vendor.address1) || "",
                address2: (vendor && vendor.address2) || "",
                city: (vendor && vendor.city) || "",
                state: (vendor && vendor.state) || "",
                zipCode: (vendor && vendor.zipCode) || "",
                telephoneNum: (vendor && vendor.telephoneNum) || "",
                attention: (vendor && vendor.attention) || "",
                prepayment: (vendor && vendor.prepayment) || "",
                prepaymentAmt: (vendor && vendor.prepaymentAmt) || 0,
              }}
              onSubmit={async (values, actions) => {
                await API.graphql({
                  query: updateVendor,
                  variables: {
                    input: {
                      id,
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
                        placeholder="John Doe"
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

export default EditVendor;
