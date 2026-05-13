import { k8sCoreV1Api } from "./config.js"



export async function createService(sandboxId){

    const serviceManifest = {
        metadata: {
            name: `sandbox-service-${sandboxId}`,
            labels: {
                id: sandboxId,
                app: "sandbox"
            }
        },
        spec: {
            selector: {
                id: sandboxId,
                app: "sandbox-instance"
            },
            ports: [
                {   
                    name: "http",
                    protocol: "TCP",
                    port: 80,
                    targetPort: 5173
                }
            ],
            type: "ClusterIP"
        }
    }

    const response = await k8sCoreV1Api.createNamespacedService({
        namespace: "default",
        body: serviceManifest
    })

    console.log("Service created:", response.metadata.name)

    return response

}