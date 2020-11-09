import { Formik, Field, Form } from "formik";
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { FormikSelect } from "../../../components/formikSelect";
import { API, withSSRContext } from "aws-amplify";
import { updateTicket } from "../../../src/graphql/mutations.ts";
import { listContracts, getTicket } from "../../../src/graphql/queries.ts";
import DatePicker from "react-datepicker";
import { useRouter } from "next/router";
import { QueryCache, useQuery } from "react-query";
import { CreateTicketSchema } from "../../../components/validationSchema";

const EditTicket = () => {
  const queryCache = new QueryCache();
  const [contracts, setContracts] = useState([]);
  const [correspondingContracts, setCorrespondingContracts] = useState([]);
  const [ticketDate, setTicketDate] = useState(new Date());
  const [ticket, setTicket] = useState();

  const router = useRouter();
  const { id } = router.query;

  const getTicketToEdit = async () => {
    const {
      data: { getTicket: myTicket },
    } = await API.graphql({
      query: getTicket,
      variables: {
        id,
      },
    });
    setTicket(myTicket);
  };

  const { data: contractsData } = useQuery("contracts", async () => {
    const {
      data: { listContracts: myContracs },
    } = await API.graphql({
      query: listContracts,
      variables: {
        limit: 3000,
      },
    });
    return myContracs;
  });

  useEffect(() => {
    if (id) {
      getTicketToEdit();
    }
  }, [id]);

  useEffect(() => {
    if (contractsData) {
      let options = [];
      contractsData.items.map((c) => {
        options.push({
          value: c.id,
          label: `${c.contractNumber} - ${c.contractTo.companyReportName} - ${c.contractType}`,
        });
      });
      setContracts(options);
      setCorrespondingContracts(options);
    }
  }, [contractsData]);

  useEffect(() => {
    if (ticket) {
      setTicketDate(new Date(ticket.ticketDate));
    }
  }, [ticket]);

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Edit Ticket</h3>
        </div>
        <div>
          {ticket && (
            <Formik
              initialValues={{
                contractId: (ticket && ticket.contractId) || "",
                correspondingContractId:
                  (ticket && ticket.correspondingContractId) || "",
                ticketDate: (ticket && ticket.ticketDate) || ticketDate,
                fieldNum: (ticket && ticket.fieldNum) || "",
                baleCount: (ticket && ticket.baleCount) || null,
                ticketNumber: (ticket && ticket.ticketNumber) || "",
                ladingNumber: (ticket && ticket.ladingNumber) || "",
                driver: (ticket && ticket.driver) || "",
                truckNumber: (ticket && ticket.truckNumber) || "",
                grossWeight: (ticket && ticket.grossWeight) || "",
                tareWeight: (ticket && ticket.tareWeight) || "",
                netWeight: (ticket && ticket.netWeight) || "",
                netTons: (ticket && ticket.netTons) || "",
              }}
              validationSchema={CreateTicketSchema}
              onSubmit={async (values, actions) => {
                console.log(ticketDate);
                const {
                  data: { updateTicket: updatedTicket },
                } = await API.graphql({
                  query: updateTicket,
                  variables: {
                    input: {
                      id,
                      contractId: values.contractId,
                      correspondingContractId: values.correspondingContractId,
                      ticketDate: ticketDate,
                      fieldNum: values.fieldNum,
                      baleCount: values.baleCount,
                      ticketNumber: values.ticketNumber,
                      ladingNumber: values.ladingNumber,
                      driver: values.driver,
                      type: "Ticket",
                      truckNumber: values.truckNumber,
                      grossWeight: values.grossWeight,
                      tareWeight: values.tareWeight,
                      netWeight: values.netWeight,
                      netTons: values.netTons,
                    },
                  },
                });
                queryCache.setQueryData("tickets", updatedTicket);
                router.push("/tickets");
              }}
            >
              {({ isSubmitting, errors, touched }) => (
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
                      {errors.ticketNumber && touched.ticketNumber ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.ticketNumber}
                        </div>
                      ) : null}
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
                        component={FormikSelect}
                        options={contracts}
                        name="contractId"
                        placeholder="Contract Number"
                      />
                      {errors.contractId && touched.contractId ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.contractId}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="correspondingContractId"
                      >
                        Corresponding Contract Number
                      </label>
                      <Field
                        className="form-select w-full"
                        component={FormikSelect}
                        options={correspondingContracts}
                        name="correspondingContractId"
                        placeholder="Contract Number"
                      />
                      {errors.correspondingContractId &&
                      touched.correspondingContractId ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.correspondingContractId}
                        </div>
                      ) : null}
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
                      {errors.ticketDate && touched.ticketDate ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.ticketDate}
                        </div>
                      ) : null}
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
                      {errors.fieldNum && touched.fieldNum ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.fieldNum}
                        </div>
                      ) : null}
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
                        type="number"
                      />
                      {errors.baleCount && touched.baleCount ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.baleCount}
                        </div>
                      ) : null}
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
                      {errors.ladingNumber && touched.ladingNumber ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.ladingNumber}
                        </div>
                      ) : null}
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
                      {errors.driver && touched.driver ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.driver}
                        </div>
                      ) : null}
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
                      {errors.truckNumber && touched.truckNumber ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.truckNumber}
                        </div>
                      ) : null}
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
                      {errors.grossWeight && touched.grossWeight ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.grossWeight}
                        </div>
                      ) : null}
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
                      {errors.tareWeight && touched.tareWeight ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.tareWeight}
                        </div>
                      ) : null}
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
                      {errors.netWeight && touched.netWeight ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.netWeight}
                        </div>
                      ) : null}
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
                      {errors.netTons && touched.netTons ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.netTons}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex justify-center mt-12 pb-24">
                      <button
                        className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
                        onClick={() => router.back()}
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

export default EditTicket;
