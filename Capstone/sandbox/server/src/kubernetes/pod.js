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

            volumes: [{
                name: "workspace-volume",
                emptyDir: {}
            }],

            initContainers: [
                {
                    name: "init-container",
                    image: "template:latest",
                    imagePullPolicy: "Never",
                    command: ["sh", "-c", "cp -r /workspace/. /seed/"],
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/seed"
                        }
                    ]

                }
            ],

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
                    },
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace"
                        }
                    ]
                },
                {
                    image: "agent:latest",
                    imagePullPolicy: "Never",
                    name: "agent-container",
                    ports: [{ containerPort: 3000, name: "http" }],
                    readinessProbe: {
                        httpGet: { path: "/", port: 3000 },
                        initialDelaySeconds: 5,
                        periodSeconds: 5
                    },
                    resources: {
                        requests: { cpu: "250m", memory: "500Mi" },
                        limits: { cpu: "500m", memory: "1Gi" }
                    },
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace"
                        }
                    ]
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