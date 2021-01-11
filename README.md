Custom built ticketing application for Premier Alfalfa.

## Workflow

- Tickets are entered and connected to a purchasing contract and sales contract
- As a ticket is entered, the app calcualtes the remaining quantity of commodity on the contract to not exceed the contracted quantity.
- Once ticket is submitted, it is duplicated for tracking purposes
- Contracts are entered in the contracts section.
- Vendors are entered in the vendors section. A Contract will have a Vendor.
- Commodities are entered in the commodities section. A Contract will have a Commodity.
- Payments are entered in the payments section. A Payment will have multiple Tickets tied to it.
- Various reports on the ticketing data is found in the Reports section.

## Stack Used

The frontend of the app uses React by way of [NextJS](https://nextjs.org/). The frontend is hosted on [Vercel](https://vercel.com/).

The backend of the app was built using [AWS Amplify](https://aws.amazon.com/amplify/) and uses various resources from AWS, including:

- DynamoDB
- Appsync
- Cognito

The API is GraphQL built using Amplify and Appsync and secured via Cognito with the `@auth` directive in Amplify.

## Frontend Libraries Used

I used several OSS libraries in this app, including:

- React Query - used for cache management and queries
- React Table - used for tabulating data easily
- React Select - used for searchable options in forms
- React DatePicker - used for date selection in forms
- Fromik
- TailwindCSS
