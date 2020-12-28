import { Formik, Field, Form } from "formik";
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { API, withSSRContext } from "aws-amplify";
import {
  updateContract,
  deleteContract,
} from "../../../src/graphql/mutations.ts";
import {
  listVendors,
  listCommoditys,
  getContract,
} from "../../../src/graphql/queries.ts";
import moment from "moment";
import DatePicker from "react-datepicker";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryCache } from "react-query";
import { FormikSelect } from "../../../components/formikSelect";
import Modal from "react-modal";
import { paymentsByContract } from "../../../src/graphql/customQueries";
import SubmitButton from "../../../components/submitButton";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const EditContract = () => {
  const queryCache = useQueryCache();
  const router = useRouter();
  const { id } = router.query;
  const [contract, setContract] = useState();
  const [commodities, setCommodities] = useState([]);
  const [dateSigned, setDateSigned] = useState(new Date());
  const [beginDate, setBeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [vendorOptions, setVendorOptions] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (contract) {
      setDateSigned(new Date(contract.dateSigned));
      setBeginDate(new Date(contract.beginDate));
      setEndDate(new Date(contract.endDate));
    }
  }, [contract]);

  const [
    deleteContractMutation,
    { data: deletedContract, error: errorDeleting, isSuccess: deleteSuccess },
  ] = useMutation(
    async () => {
      const { data: contractData } = await API.graphql({
        query: deleteContract,
        variables: {
          input: { id },
        },
      });
      return contractData;
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries("contracts");
        router.back();
      },
    }
  );

  const { data: commoditysData } = useQuery("commodities", async () => {
    const {
      data: { listCommoditys: commoditiesData },
    } = await API.graphql({
      query: listCommoditys,
    });
    return commoditiesData;
  });

  const { data: vendorsData } = useQuery("vendors", async () => {
    const {
      data: { listVendors: myVendors },
    } = await API.graphql({
      query: listVendors,
      variables: {
        limit: 3000,
      },
    });
    return myVendors;
  });

  const getMyContract = async () => {
    const {
      data: { getContract: myContract },
    } = await API.graphql({
      query: getContract,
      variables: {
        id,
      },
    });
    setContract(myContract);
  };

  const initVendorOptions = () => {
    const options = vendorsData.items.map((v) => {
      return { value: v.id, label: v.companyReportName };
    });
    setVendorOptions(options);
  };

  useEffect(() => {
    if (commoditysData) {
      setCommodities(commoditysData.items);
    }
  }, [commoditysData]);

  useEffect(() => {
    if (vendorsData) {
      initVendorOptions();
    }
  }, [vendorsData]);

  useEffect(() => {
    getMyContract();
  }, [id]);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDeleteContract = () => {
    if (
      contract.tickets.items.length > 0 ||
      contract.payments.items.length > 0
    ) {
      alert(
        "Contract cannot be deleted as it has attached tickets and/or payments."
      );
      closeModal();
      return;
    } else {
      deleteContractMutation();
    }
  };

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Edit Contract</h3>
        </div>
        <div className="flex justify-between">
          <div className="w-11/12 pb-24">
            {contract && (
              <Formik
                initialValues={{
                  contractNumber: (contract && contract.contractNumber) || "",
                  contractType: (contract && contract.contractType) || "",
                  contractState: (contract && contract.contractState) || "",
                  vendorId: contract.vendorId || "",
                  soldTo: contract.soldTo || "",
                  commodityId: (contract && contract.commodityId) || "",
                  quantity: (contract && contract.quantity) || 0,
                  contractPrice: (contract && contract.contractPrice) || 0,
                  salePrice: (contract && contract.salePrice) || 0,
                  terms: (contract && contract.terms) || "",
                  weights: (contract && contract.weights) || "",
                  basis: (contract && contract.basis) || "",
                  remarks: (contract && contract.remarks) || "",
                  beginDate: (contract && contract.beginDate) || "",
                  endDate: (contract && contract.endDate) || "",
                  dateSigned: (contract && contract.dateSigned) || "",
                }}
                onSubmit={async (values, actions) => {
                  await API.graphql({
                    query: updateContract,
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
                        endDate: moment(endDate),
                        dateSigned: moment(dateSigned),
                        id,
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
                          className="form-select w-full"
                          name="vendorId"
                          component={FormikSelect}
                          as="select"
                          options={vendorOptions}
                        ></Field>
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
                          htmlFor="contractPrice"
                        >
                          Contract Price
                        </label>
                        <Field
                          className="form-input w-full"
                          name="contractPrice"
                          type="number"
                        />
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
          <div className="mt-24">
            <button
              className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
              type="button"
              onClick={() => openModal()}
            >
              Delete Contract
            </button>
          </div>
          <div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => closeModal}
              style={customStyles}
              contentLabel="Delete Contract"
            >
              <div>
                <p>Are you sure you want to delete this contract?</p>
                <div>
                  <button
                    className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
                    type="button"
                    onClick={() => handleDeleteContract()}
                  >
                    Delete Contract
                  </button>
                  <button
                    className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
                    type="button"
                    onClick={() => closeModal()}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          </div>
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

export default EditContract;
