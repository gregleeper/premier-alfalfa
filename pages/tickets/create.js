import { Formik, Field, Form } from "formik";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FormikSelect } from "../../components/formikSelect";
import Layout from "../../components/layout";
import { API, withSSRContext } from "aws-amplify";
import { createTicket } from "../../src/graphql/mutations.ts";
import { listContracts } from "../../src/graphql/queries.ts";
import DatePicker from "react-datepicker";
import { useQuery, useMutation, useQueryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { CreateTicketSchema } from "../../components/validationSchema";

const CreateTicket = () => {
  const queryCache = useQueryCache();
  const router = useRouter();
  const [contracts, setContracts] = useState([]);
  const [correspondingContracts, setCorrespondingContracts] = useState([]);
  const [ticketDate, setTicketDate] = useState(new Date());

  const [mutate, { data, error, isSuccess }] = useMutation(
    async (input) => {
      const { data: ticketData } = await API.graphql({
        query: createTicket,
        variables: {
          input,
        },
      });
      return ticketData;
    },
    {
      onSuccess: ({ createTicket }) => {
        const lengthOfGroups = queryCache.getQueryData("tickets").length;
        const items = queryCache.getQueryData("tickets")[lengthOfGroups - 1]
          .items;
        let previousData = queryCache.getQueryData("tickets");
        previousData[lengthOfGroups - 1].items.push(createTicket);
        return () => queryCache.setQueryData("tickets", () => [previousData]);
      },
    }
  );

  console.log(ticketDate);

  const { data: contractsData } = useQuery(
    "contracts",
    async () => {
      const {
        data: { listContracts: contractsData },
      } = await API.graphql({
        query: listContracts,
        variables: {
          limit: 3000,
        },
      });
      return contractsData;
    },
    {
      cacheTime: 1000 * 60 * 20,
    }
  );

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
              correspondingContractId: "",
              ticketDate: ticketDate,
              fieldNum: "",
              baleCount: 0,
              ticketNumber: "",
              ladingNumber: "",
              driver: "",
              truckNumber: "",
              grossWeight: 0,
              tareWeight: 0,
              netWeight: 0,
              netTons: 0,
            }}
            validationSchema={CreateTicketSchema}
            onSubmit={async (values, actions) => {
              console.log(ticketDate);
              const input1 = {
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
              };

              mutate(input1);

              const input2 = {
                contractId: values.correspondingContractId,
                correspondingContractId: values.contractId,
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
              };
              mutate(input2);

              actions.resetForm();
            }}
          >
            {({ isSubmitting, errors, touched, values }) => (
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
                      Contract Number - Purchased From
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
                      Corresponding Contract Number - Sold To
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
                      onChange={(date) => {
                        console.log(date), setTicketDate(date);
                      }}
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
                  </div>
                  <div className="flex justify-between items-center mb-4 w-full">
                    <label
                      className="text-gray-900 w-1/4 md:w-1/2 pr-4"
                      name="ladingNumber"
                    >
                      Lading Number
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
                    {errors.drivers && touched.drivers ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.drivers}
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

                  <div className="flex justify-center mt-12">
                    <button
                      className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
                      type="submit"
                      // disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          <ReactQueryDevtools />
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

export default CreateTicket;
