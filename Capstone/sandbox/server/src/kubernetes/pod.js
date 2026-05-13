import { k8sCoreV1Api } from "./config.js";



export async function createPod(sandboxId) {

    const podManifest = {
        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                app: "sandbox-instance",
                id: sandboxId
            }
        },
        spec: {
            containers: [
                {
                    image: "template:latest",
                    imagePullPolicy: "Never",
                    name: "sandbox-container",
                    ports: [{ containerPort: 5173, name: "http" }],
                    readinessProbe: {
                    httpGet: {
                      path: "/",
                       port: 5173
                       },
                      initialDelaySeconds: 5,
                      periodSeconds: 5
                    },
                    resources: {
                        requests: { cpu: "250m", memory: "500Mi" },
                        limits: { cpu: "500m", memory: "1Gi" }
                    }
                }

            ]
        }

    }

    const response = await k8sCoreV1Api.createNamespacedPod({
        namespace: "default",
        body: podManifest
    })

    console.log("Pod created:", response.metadata.name)

    return response

}