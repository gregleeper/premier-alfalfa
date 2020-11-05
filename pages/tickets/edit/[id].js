import { Formik, Field, Form } from "formik";
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { FormikSelect } from "../../../components/formikSelect";
import { API, withSSRContext } from "aws-amplify";
import { updateTicket } from "../../../src/graphql/mutations.ts";
import { listContracts, getTicket } from "../../../src/graphql/queries.ts";
import DatePicker from "react-datepicker";
import { useRouter } from "next/router";
import { QueryCache, useQuery, useQueryCache } from "react-query";

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
                baleCount: (ticket && ticket.baleCount) || "",
                ticketNumber: (ticket && ticket.ticketNumber) || "",
                ladingNumber: (ticket && ticket.ladingNumber) || "",
                driver: (ticket && ticket.driver) || "",
                truckNumber: (ticket && ticket.truckNumber) || "",
                grossWeight: (ticket && ticket.grossWeight) || "",
                tareWeight: (ticket && ticket.tareWeight) || "",
                netWeight: (ticket && ticket.netWeight) || "",
                netTons: (ticket && ticket.netTons) || "",
              }}
              onSubmit={async (values, actions) => {
                console.log(values);
                const {
                  data: { updateTicket: updatedTicket },
                } = await API.graphql({
                  query: updateTicket,
                  variables: {
                    input: {
                      id,
                      contractId: values.contractId,
                      correspondingContractId: values.correspondingContractId,
                      ticketDate: values.ticketDate,
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
                        component={FormikSelect}
                        options={contracts}
                        name="contractId"
                        placeholder="Contract Number"
                      />
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
