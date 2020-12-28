import { Formik, Field, Form } from "formik";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { API, withSSRContext } from "aws-amplify";
import { createContract } from "../../src/graphql/mutations.ts";
import { listVendors, listCommoditys } from "../../src/graphql/queries.ts";
import moment from "moment";
import DatePicker from "react-datepicker";
import { FormikSelect } from "../../components/formikSelect";
import { useQuery } from "react-query";
import { CreateContractSchema } from "../../components/validationSchema";
import SubmitButton from "../../components/submitButton";
const CreateContract = () => {
  const router = useRouter();
  const [commodities, setCommodities] = useState([]);
  const [dateSigned, setDateSigned] = useState(new Date());
  const [beginDate, setBeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [vendorOptions, setVendorOptions] = useState([]);

  const initVendorOptions = () => {
    const options = vendorsData.items.map((v) => {
      return { value: v.id, label: v.companyReportName };
    });
    setVendorOptions(options);
  };

  const { data: vendorsData } = useQuery(
    "vendors",
    async () => {
      const {
        data: { listVendors: vendorsData },
      } = await API.graphql({
        query: listVendors,
        variables: {
          limit: 3000,
        },
      });
      return vendorsData;
    },
    {
      cacheTime: 1000 * 60 * 60,
    }
  );

  const { data: commoditysData } = useQuery("commodities", async () => {
    const {
      data: { listCommoditys: commoditiesData },
    } = await API.graphql({
      query: listCommoditys,
      variables: {
        limit: 3000,
      },
    });
    return commoditiesData;
  });

  useEffect(() => {
    if (commoditysData) {
      setCommodities(commoditysData.items);
    }
  }, [commoditysData, vendorsData]);

  useEffect(() => {
    if (vendorsData) {
      initVendorOptions();
    }
  }, [vendorsData]);

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Create Contract</h3>
        </div>
        <div>
          {vendorOptions && (
            <Formik
              initialValues={{
                contractNumber: "",
                contractType: "",
                contractState: "",
                vendorId: "",
                soldTo: "",
                commodityId: "",
                quantity: 0,
                contractPrice: 0,
                salePrice: 0,
                terms: "",
                weights: "",
                basis: "",
                remarks: "",
                beginDate: "",
                endDate: "",
                dateSigned: "",
              }}
              validationSchema={CreateContractSchema}
              onSubmit={async (values, actions) => {
                await API.graphql({
                  query: createContract,
                  variables: {
                    input: {
                      contractNumber: values.contractNumber,
                      contractType: values.contractType,
                      contractState: values.contractState,
                      vendorId: values.vendorId,
                      soldTo: values.soldTo,
                      commodityId: values.commodityId,
                      quantity: values.quantity,
                      contractPrice: values.contractPrice,
                      salePrice: values.salePrice,
                      terms: values.terms,
                      weights: values.weights,
                      basis: values.basis,
                      remarks: values.remarks,
                      beginDate: moment(beginDate),
                      endDate: moment(endDate).add(10, "hours"),
                      dateSigned: moment(dateSigned).subtract(10, "hours"),
                    },
                  },
                });
                actions.resetForm();
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <div className="w-7/12 mx-auto">
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="contractNumber"
                      >
                        Contract Number
                      </label>
                      <Field
                        className="form-input w-full"
                        name="contractNumber"
                        placeholder="Contract Number"
                      />
                      {errors.contractNumber && touched.contractNumber ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.contractNumber}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="dateSigned"
                      >
                        Date Signed
                      </label>
                      <DatePicker
                        selected={dateSigned}
                        onChange={(date) => setDateSigned(date)}
                        className="form-input w-full"
                      />
                      {errors.dateSigned && touched.dateSigned ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.dateSigned}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="beginDate"
                      >
                        Begin Date
                      </label>
                      <DatePicker
                        selected={beginDate}
                        onChange={(date) => setBeginDate(date)}
                        className="form-input w-full"
                        startDate={beginDate}
                        selectsStart
                      />
                    </div>
                    {errors.beginDate && touched.beginDate ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.beginDate}
                      </div>
                    ) : null}
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="endDate"
                      >
                        End Date
                      </label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        endDate={endDate}
                        minDate={beginDate}
                        className="form-input w-full"
                      />
                      {errors.endDate && touched.endDate ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.endDate}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="contractType"
                      >
                        Contract Type
                      </label>

                      <Field
                        className="form-select w-full"
                        name="contractType"
                        as="select"
                      >
                        <option value="">Choose One</option>
                        <option value="SALE">Sale</option>
                        <option value="PURCHASE">Purchase</option>
                      </Field>
                      {errors.contractType && touched.contractType ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.contractType}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="contractState"
                      >
                        Contract State
                      </label>

                      <Field
                        className="form-select w-full"
                        name="contractState"
                        as="select"
                      >
                        <option value="">Choose One:</option>
                        <option value="ACTIVE">Active</option>
                        <option value="CLOSED">Closed</option>
                      </Field>
                      {errors.contractState && touched.contractState ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.contractState}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4 w-full">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2 pr-4"
                        name="vendorId"
                      >
                        Vendor
                      </label>
                      <Field
                        className="w-full"
                        name="vendorId"
                        component={FormikSelect}
                        options={vendorOptions}
                      ></Field>
                      {errors.vendorId && touched.vendorId ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.vendorId}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="soldTo"
                      >
                        Sold To
                      </label>
                      <Field
                        className="form-input w-full"
                        name="soldTo"
                        placeholder="Sold To"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="commodityId"
                      >
                        Commodity
                      </label>
                      <Field
                        className="form-select w-full"
                        name="commodityId"
                        as="select"
                      >
                        <option value="">Choose One:</option>
                        {commodities.length > 0 &&
                          commodities.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                      </Field>
                      {errors.commodityId && touched.commodityId ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.commodityId}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="quantity"
                      >
                        Quantity
                      </label>
                      <Field
                        className="form-input w-full"
                        name="quantity"
                        type="number"
                      />
                      {errors.quantity && touched.quantity ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.quantity}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="contractPrice"
                      >
                        Contract Purchase Price
                      </label>
                      <Field
                        className="form-input w-full"
                        name="contractPrice"
                        type="number"
                      />
                      {errors.contractPrice && touched.contractPrice ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.contractPrice}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="salePrice"
                      >
                        Sale Price
                      </label>
                      <Field
                        className="form-input w-full"
                        name="salePrice"
                        type="number"
                      />
                      {errors.salePrice && touched.salePrice ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.salePrice}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="terms"
                      >
                        Terms
                      </label>
                      <Field
                        className="form-textarea w-full"
                        name="terms"
                        component="textarea"
                      />
                      {errors.terms && touched.terms ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.terms}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="weights"
                      >
                        Weights
                      </label>
                      <Field
                        className="form-textarea w-full"
                        name="weights"
                        component="textarea"
                      />
                      {errors.weights && touched.weights ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.weights}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="basis"
                      >
                        Basis
                      </label>
                      <Field
                        className="form-textarea w-full"
                        name="basis"
                        component="textarea"
                      />
                      {errors.basis && touched.basis ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.basis}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="remarks"
                      >
                        Remarks
                      </label>
                      <Field
                        className="form-textarea w-full"
                        name="remarks"
                        component="textarea"
                      />
                      {errors.remarks && touched.remarks ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.remarks}
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

export default CreateContract;
