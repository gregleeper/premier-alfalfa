import { Formik, Field, Form } from "formik";
import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import { API } from "aws-amplify";
import { createTicket } from "../../src/graphql/mutations.ts";
import { listContracts } from "../../src/graphql/queries.ts";
import DatePicker from "react-datepicker";

const CreateTicket = () => {
  const [contracts, setContracts] = useState([]);
  const [ticketDate, setTicketDate] = useState(new Date());

  const getAllContracts = async () => {
    const {
      data: {
        listContracts: { items: allContracts },
      },
    } = await API.graphql({
      query: listContracts,
    });
    setContracts(allContracts);
  };

  useEffect(() => {
    getAllContracts();
  }, []);

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Create Ticket</h3>
        </div>
        <div>
          <Formik
            initialValues={{
              contractId: "",
              ticketDate: ticketDate,
              fieldNum: "",
              baleCount: "",
              ticketNumber: "",
              ladingNumber: "",
              driver: "",
              truckNumber: "",
              grossWeight: "",
              tareWeight: "",
              netWeight: "",
              netTons: "",
            }}
            onSubmit={async (values, actions) => {
              await API.graphql({
                query: createTicket,
                variables: {
                  input: {
                    contractId: values.contractId,
                    ticketDate: values.ticketDate,
                    fieldNum: values.fieldNum,
                    baleCount: values.baleCount,
                    ticketNumber: values.ticketNumber,
                    ladingNumber: values.ladingNumber,
                    driver: values.driver,
                    truckNumber: values.truckNumber,
                    grossWeight: values.grossWeight,
                    tareWeight: values.tareWeight,
                    netWeight: values.netWeight,
                    netTons: values.netTons,
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
                      htmlFor="ticketNumber"
                    >
                      Ticket Number
                    </label>
                    <Field
                      className="form-input w-full"
                      name="ticketNumber"
                      placeholder="Ticket Number"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2"
                      htmlFor="contractId"
                    >
                      Contract Number
                    </label>
                    <Field
                      className="form-select w-full"
                      name="contractId"
                      as="select"
                      placeholder="Contract Number"
                    >
                      <option value="">Choose One:</option>
                      {contracts &&
                        contracts.map((c) => (
                          <option key={c.id} value={c.id}>
                            {`${c.contractNumber} for ${c.contractTo.companyListingName}`}
                          </option>
                        ))}
                    </Field>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2"
                      htmlFor="ticketDate"
                    >
                      Ticket Date
                    </label>
                    <DatePicker
                      selected={ticketDate}
                      onChange={(date) => setTicketDate(date)}
                      className="form-input w-full"
                    />
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2"
                      htmlFor="fieldNum"
                    >
                      Field Number
                    </label>

                    <Field
                      className="form-input w-full"
                      name="fieldNum"
                      placeholder="Field Number"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2"
                      htmlFor="baleCount"
                    >
                      Bale Count
                    </label>

                    <Field
                      className="form-input w-full"
                      name="baleCount"
                      placeholder="Bale Count"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4 w-full">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2 pr-4"
                      name="ladingNumber"
                    >
                      Vendor
                    </label>
                    <Field
                      className="form-input w-full"
                      name="ladingNumber"
                      placeholder="Lading Number"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="driver"
                    >
                      Driver
                    </label>
                    <Field
                      className="form-input w-full"
                      name="driver"
                      placeholder="Driver"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="truckNumber"
                    >
                      Truck Number
                    </label>
                    <Field
                      className="form-input w-full"
                      name="truckNumber"
                      placeholder="Truck Number"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="grossWeight"
                    >
                      Gross Weight
                    </label>
                    <Field
                      className="form-input w-full"
                      name="grossWeight"
                      type="number"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="tareWeight"
                    >
                      Tare Weight
                    </label>
                    <Field
                      className="form-input w-full"
                      name="tareWeight"
                      type="number"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="netWeight"
                    >
                      Net Weight
                    </label>
                    <Field
                      className="form-input w-full"
                      name="netWeight"
                      type="number"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <label
                      className="w-1/4 text-gray-900 md:w-1/2"
                      htmlFor="netTons"
                    >
                      Net Tons
                    </label>
                    <Field
                      className="form-input w-full"
                      name="netTons"
                      type="number"
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

export default CreateTicket;
