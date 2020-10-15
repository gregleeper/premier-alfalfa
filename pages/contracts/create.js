import { Formik, Field, Form } from "formik";
import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import { API } from "aws-amplify";
import { createContract } from "../../src/graphql/mutations.ts";
import { listVendors, listCommoditys } from "../../src/graphql/queries.ts";
import moment from "moment";
import DatePicker from "react-datepicker";
import { FormikSelect } from "../../components/formikSelect";

const CreateContract = ({ allVendors }) => {
  const [commodities, setCommodities] = useState([]);
  const [dateSigned, setDateSigned] = useState(new Date());
  const [beginDate, setBeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [vendorOptions, setVendorOptions] = useState([]);

  const initVendorOptions = () => {
    const options = allVendors.map((v) => {
      return { value: v.id, label: v.companyReportName };
    });
    setVendorOptions(options);
  };

  const getAllCommodities = async () => {
    const {
      data: {
        listCommoditys: { items: allCommodities },
      },
    } = await API.graphql({
      query: listCommoditys,
    });
    setCommodities(allCommodities);
  };

  useEffect(() => {
    getAllCommodities();
  }, []);

  useEffect(() => {
    if (allVendors) {
      initVendorOptions();
    }
  }, [allVendors]);

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
                commodityId: "",
                quantity: "",
                price: "",
                terms: "",
                weights: "",
                basis: "",
                remarks: "",
                beginDate: "",
                endDate: "",
                dateSigned: "",
              }}
              onSubmit={async (values, actions) => {
                await API.graphql({
                  query: createContract,
                  variables: {
                    input: {
                      contractNumber: values.contractNumber,
                      contractType: values.contractType,
                      contractState: values.contractState,
                      vendorId: values.vendorId,
                      commodityId: values.commodityId,
                      quantity: values.quantity,
                      price: values.price,
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
              {({ isSubmitting, values }) => (
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
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="price"
                      >
                        Price
                      </label>
                      <Field
                        className="form-input w-full"
                        name="price"
                        type="number"
                      />
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

export async function getStaticProps({ preview = null }) {
  const {
    data: {
      listVendors: { items: allVendors },
    },
  } =
    (await API.graphql({
      query: listVendors,
      variables: { limit: 1000 },
    })) || [];

  return {
    props: {
      allVendors,
      preview,
    },
    revalidate: 1,
  };
}

export default CreateContract;
