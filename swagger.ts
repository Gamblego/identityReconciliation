import SwaggerJsDoc from 'swagger-jsdoc';

const options: any = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Assignment for BiteSpeed",
            version: "0.1.0",
            description: "this is an API application for Backend Task: Identity Reconciliation "
        },
        servers: [
            {
                url: "http://localhost:8000",
                description: "local development server"
            }
        ]
    },
    apis: ["./src/routes/*.ts", "./src/interface/*.ts"]
}

export const SwaggerSpecifications = SwaggerJsDoc(options);